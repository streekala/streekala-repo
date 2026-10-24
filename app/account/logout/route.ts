import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  authDebug,
  clearSession,
  discovery,
  readSession,
  siteOrigin,
  verifyLogoutIdToken,
} from "@/lib/customer-auth";

export async function GET() {
  const store = await cookies();
  const session = readSession(store);
  clearSession(store);
  const root = new URL("/", siteOrigin());
  try {
    const config = await discovery();
    if (!config.end_session_endpoint) return NextResponse.redirect(root);
    const target = new URL(config.end_session_endpoint);
    target.searchParams.set("client_id", process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID!);
    target.searchParams.set("post_logout_redirect_uri", root.toString());
    if (!session?.idToken) {
      authDebug("logout-without-id-token", {});
      return NextResponse.redirect(root);
    }
    try {
      await verifyLogoutIdToken(session.idToken, config);
      target.searchParams.set("id_token_hint", session.idToken);
      authDebug("logout-id-token-accepted", {});
    } catch (error) {
      authDebug("logout-id-token-rejected", {
        reason: error instanceof Error ? error.name : "unknown",
      });
      return NextResponse.redirect(root);
    }
    return NextResponse.redirect(target);
  } catch {
    authDebug("logout-discovery-failed", {});
    return NextResponse.redirect(root);
  }
}
