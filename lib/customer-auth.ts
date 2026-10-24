import { createCipheriv, createDecipheriv, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { createRemoteJWKSet, jwtVerify } from "jose";

const COOKIES = {
  metadata: "streekala_customer_session",
  access: "streekala_customer_access",
  refresh: "streekala_customer_refresh",
  id: "streekala_customer_id",
  oauth: "streekala_customer_oauth",
} as const;
const SCOPE = "openid email customer-account-api:full";
const MAX_AGE = 60 * 60 * 24 * 30;
type CookieStore = Awaited<ReturnType<typeof cookies>>;

type Discovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  end_session_endpoint?: string;
  jwks_uri: string;
  issuer: string;
};

type Session = {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
};

export type CustomerProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
};

export type CustomerOrder = {
  id: string;
  name: string;
  createdAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  totalPrice: { amount: string; currencyCode: string };
};

type OAuthState = { state: string; nonce: string; verifier: string; returnTo: string };

export function authDebug(stage: string, details: Record<string, string | number | boolean>) {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[customer-auth] ${stage}`, details);
  }
}

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function siteOrigin() {
  const value = new URL(required("SITE_ORIGIN"));
  if (value.pathname !== "/" || value.search || value.hash) {
    throw new Error("SITE_ORIGIN must contain only an origin.");
  }
  return value;
}

export function callbackUrl() {
  return new URL("/account/authorize", siteOrigin()).toString();
}

function shopDomain() {
  return required("SHOPIFY_STORE_DOMAIN").replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function key() {
  return createHash("sha256").update(required("SESSION_SECRET")).digest();
}

function encode(value: Buffer) {
  return value.toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url");
}

function seal(value: unknown) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const encrypted = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(encode).join(".");
}

function unseal<T>(value: string): T | null {
  try {
    const [iv, tag, encrypted] = value.split(".");
    if (!iv || !tag || !encrypted) return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), decode(iv));
    decipher.setAuthTag(decode(tag));
    return JSON.parse(Buffer.concat([decipher.update(decode(encrypted)), decipher.final()]).toString("utf8")) as T;
  } catch {
    return null;
  }
}

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export async function discovery() {
  const response = await fetch(`https://${shopDomain()}/.well-known/openid-configuration`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to discover Shopify authentication endpoints.");
  const value = (await response.json()) as Partial<Discovery>;
  if (!value.authorization_endpoint || !value.token_endpoint || !value.jwks_uri || !value.issuer) {
    throw new Error("Shopify discovery response is incomplete.");
  }
  return value as Discovery;
}

async function customerApiUrl() {
  const response = await fetch(`https://${shopDomain()}/.well-known/customer-account-api`, { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to discover the Customer Account API.");
  const value = (await response.json()) as { graphql_api?: string };
  if (!value.graphql_api) throw new Error("Customer Account API discovery response is incomplete.");
  return value.graphql_api;
}

export function pkceVerifier() {
  return encode(randomBytes(32));
}

export function pkceChallenge(verifier: string) {
  return encode(createHash("sha256").update(verifier).digest());
}

export function randomValue() {
  return encode(randomBytes(32));
}

export function safeReturnTo(value: string | null) {
  return Boolean(value?.startsWith("/") && !value.startsWith("//"));
}

export function saveOAuth(store: CookieStore, state: OAuthState) {
  store.set(COOKIES.oauth, seal(state), { ...cookieOptions, maxAge: 600 });
}

export function takeOAuth(store: CookieStore) {
  const value = store.get(COOKIES.oauth)?.value;
  store.delete(COOKIES.oauth);
  return value ? unseal<OAuthState>(value) : null;
}

export function saveSession(store: CookieStore, session: Session) {
  store.set(COOKIES.metadata, seal({ expiresAt: session.expiresAt }), { ...cookieOptions, maxAge: MAX_AGE });
  store.set(COOKIES.access, seal(session.accessToken), { ...cookieOptions, maxAge: MAX_AGE });
  store.set(COOKIES.refresh, seal(session.refreshToken), { ...cookieOptions, maxAge: MAX_AGE });
  store.set(COOKIES.id, seal(session.idToken), { ...cookieOptions, maxAge: MAX_AGE });
  authDebug("session-cookies-written", {
    metadata: true,
    access: true,
    refresh: true,
    id: true,
  });
}

export function clearSession(store: CookieStore) {
  Object.values(COOKIES).forEach((name) => store.delete(name));
}

export function readSession(store: CookieStore): Session | null {
  const metadata = store.get(COOKIES.metadata)?.value;
  const access = store.get(COOKIES.access)?.value;
  const refresh = store.get(COOKIES.refresh)?.value;
  const id = store.get(COOKIES.id)?.value;
  if (!metadata || !access || !refresh || !id) {
    authDebug("session-missing-cookie", {
      metadata: Boolean(metadata),
      access: Boolean(access),
      refresh: Boolean(refresh),
      id: Boolean(id),
    });
    return null;
  }
  const expiresAt = unseal<{ expiresAt: number }>(metadata)?.expiresAt;
  const accessToken = unseal<string>(access);
  const refreshToken = unseal<string>(refresh);
  const idToken = unseal<string>(id);
  if (typeof expiresAt !== "number" || !accessToken || !refreshToken || !idToken) {
    authDebug("session-unreadable", {
      metadata: Boolean(expiresAt),
      access: Boolean(accessToken),
      refresh: Boolean(refreshToken),
      id: Boolean(idToken),
    });
    return null;
  }
  authDebug("session-readable", {
    expiresAt,
    expired: expiresAt <= Date.now() + 60_000,
  });
  return { expiresAt, accessToken, refreshToken, idToken };
}

async function refresh(store: CookieStore, session: Session, config: Discovery) {
  const response = await fetch(config.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: session.refreshToken,
      client_id: required("NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID"),
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { error?: string } | null;
    authDebug("refresh-failed", {
      status: response.status,
      error: error?.error ?? "unknown",
    });
    throw new AuthRefreshError(response.status);
  }
  const token = (await response.json()) as Partial<Record<"access_token" | "refresh_token" | "id_token", string>> & { expires_in?: number };
  if (!token.access_token || !token.refresh_token || !token.id_token || !token.expires_in) {
    authDebug("refresh-incomplete", { status: response.status });
    throw new AuthRefreshError(response.status);
  }
  const next = { accessToken: token.access_token, refreshToken: token.refresh_token, idToken: token.id_token, expiresAt: Date.now() + token.expires_in * 1000 };
  saveSession(store, next);
  return next;
}

export async function validSession(store: CookieStore) {
  const session = readSession(store);
  if (!session) {
    authDebug("valid-session-missing", {});
    return null;
  }
  if (session.expiresAt > Date.now() + 60_000) return session;
  try {
    return await refresh(store, session, await discovery());
  } catch (error) {
    if (error instanceof AuthRefreshError && error.status >= 400 && error.status < 500) {
      authDebug("valid-session-refresh-rejected", { status: error.status });
      clearSession(store);
    } else {
      authDebug("valid-session-refresh-transient-failure", {
        reason: error instanceof Error ? error.name : "unknown",
      });
    }
    return null;
  }
}

class AuthRefreshError extends Error {
  constructor(public readonly status: number) {
    super("Shopify session refresh failed.");
  }
}

export async function exchange(code: string, verifier: string) {
  const config = await discovery();
  const response = await fetch(config.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: required("NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID"),
      redirect_uri: callbackUrl(),
      code,
      code_verifier: verifier,
    }),
    cache: "no-store",
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { error?: string } | null;
    authDebug("code-exchange-failed", {
      status: response.status,
      error: error?.error ?? "unknown",
    });
    throw new Error("Shopify authorization code exchange failed.");
  }
  const token = (await response.json()) as Partial<Record<"access_token" | "refresh_token" | "id_token", string>> & { expires_in?: number };
  if (!token.access_token || !token.refresh_token || !token.id_token || !token.expires_in) throw new Error("Shopify token response is incomplete.");
  return { config, token };
}

export async function verifyIdToken(idToken: string, config: Discovery, nonce: string) {
  const result = await jwtVerify(idToken, createRemoteJWKSet(new URL(config.jwks_uri)), {
    issuer: config.issuer,
    audience: required("NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID"),
  });
  if (result.payload.nonce !== nonce) throw new Error("Invalid Shopify nonce.");
  return result.payload;
}

export function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

async function customerRequest<T>(accessToken: string, query: string) {
  const response = await fetch(await customerApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: accessToken },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });
  const result = (await response.json().catch(() => null)) as
    | { data?: T; errors?: { message?: string; extensions?: { code?: string } }[]; error?: string } | null;
  if (response.status === 401) {
    authDebug("customer-api-unauthorized", {
      status: response.status,
      errorCodes: result?.errors?.map((error) => error.extensions?.code ?? "unknown").join(",") ?? result?.error ?? "none",
    });
    return { unauthorized: true as const };
  }
  if (!response.ok) {
    authDebug("customer-api-http-error", {
      status: response.status,
      errorCodes: result?.errors?.map((error) => error.extensions?.code ?? "unknown").join(",") ?? result?.error ?? "none",
    });
    throw new Error("Customer Account API request failed.");
  }
  if (result?.errors?.length) {
    authDebug("customer-api-graphql-error", {
      errorCodes: result.errors.map((error) => error.extensions?.code ?? "unknown").join(","),
      errorMessages: result.errors.map((error) => (error.message ?? "unknown").slice(0, 120)).join(" | "),
    });
    throw new Error("Customer Account API returned an error.");
  }
  return { data: result?.data };
}

export async function profile(accessToken: string) {
  const result = await customerRequest<{ customer?: { id: string; firstName: string | null; lastName: string | null; emailAddress?: { emailAddress: string | null } | null } | null }>(accessToken, `query { customer { id firstName lastName emailAddress { emailAddress } } }`);
  if ("unauthorized" in result || !result.data?.customer) return { unauthorized: true as const };
  const customer = result.data.customer;
  return { customer: { id: customer.id, firstName: customer.firstName, lastName: customer.lastName, email: customer.emailAddress?.emailAddress ?? "" } };
}

export async function orders(accessToken: string) {
  const result = await customerRequest<{ customer?: { orders?: { edges: { node: CustomerOrder }[] } | null } | null }>(accessToken, `query { customer { orders(first: 50, sortKey: CREATED_AT, reverse: true) { edges { node { id name createdAt financialStatus fulfillmentStatus totalPrice { amount currencyCode } } } } } }`);
  if ("unauthorized" in result || !result.data?.customer) return { unauthorized: true as const };
  return { orders: result.data.customer.orders?.edges.map(({ node }) => node) ?? [] };
}

export { COOKIES, SCOPE };
