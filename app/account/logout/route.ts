import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearSession, discovery, siteOrigin, readSession } from "@/lib/customer-auth";

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
    if (session?.idToken) target.searchParams.set("id_token_hint", session.idToken);
    return NextResponse.redirect(target);
  } catch {
    return NextResponse.redirect(root);
  }
}
