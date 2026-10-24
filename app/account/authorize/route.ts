import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  equal,
  exchange,
  callbackUrl,
  discovery,
  pkceChallenge,
  pkceVerifier,
  randomValue,
  safeReturnTo,
  saveOAuth,
  saveSession,
  takeOAuth,
  verifyIdToken,
  SCOPE,
  authDebug,
} from "@/lib/customer-auth";

function accountError(message: string) {
  const target = new URL("/account", process.env.SITE_ORIGIN);
  target.searchParams.set("auth_error", message);
  return NextResponse.redirect(target);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const store = await cookies();
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code && !state && !url.searchParams.has("error")) {
    try {
      const config = await discovery();
      const verifier = pkceVerifier();
      const oauthState = randomValue();
      const nonce = randomValue();
      saveOAuth(store, { state: oauthState, nonce, verifier, returnTo: safeReturnTo(url.searchParams.get("return_to")) ? url.searchParams.get("return_to")! : "/" });
      authDebug("oauth-started", { returnTo: safeReturnTo(url.searchParams.get("return_to")) ? url.searchParams.get("return_to")! : "/" });
      const target = new URL(config.authorization_endpoint);
      target.searchParams.set("client_id", process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID!);
      target.searchParams.set("response_type", "code");
      target.searchParams.set("redirect_uri", callbackUrl());
      target.searchParams.set("scope", SCOPE);
      target.searchParams.set("state", oauthState);
      target.searchParams.set("nonce", nonce);
      target.searchParams.set("code_challenge", pkceChallenge(verifier));
      target.searchParams.set("code_challenge_method", "S256");
      return NextResponse.redirect(target);
    } catch {
      return accountError("Unable to start Shopify sign in.");
    }
  }

  const saved = takeOAuth(store);
  if (url.searchParams.has("error")) return accountError("Shopify sign in was cancelled or denied.");
  if (!code || !state || !saved || !equal(state, saved.state)) return accountError("Your sign-in session expired. Please try again.");

  try {
    const { config, token } = await exchange(code, saved.verifier);
    const claims = await verifyIdToken(token.id_token!, config, saved.nonce);
    if (typeof claims.sub !== "string" || typeof claims.email !== "string") throw new Error("Incomplete Shopify identity.");
    saveSession(store, {
      accessToken: token.access_token!,
      refreshToken: token.refresh_token!,
      idToken: token.id_token!,
      expiresAt: Date.now() + token.expires_in! * 1000,
    });
    authDebug("oauth-session-saved", { expiresAt: Date.now() + token.expires_in! * 1000 });
    return NextResponse.redirect(new URL(saved.returnTo, process.env.SITE_ORIGIN));
  } catch (error) {
    authDebug("oauth-callback-failed", {
      reason: error instanceof Error ? error.name : "unknown",
    });
    return accountError("Unable to complete Shopify sign in. Please try again.");
  }
}
