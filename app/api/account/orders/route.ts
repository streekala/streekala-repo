import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authDebug, clearSession, orders, validSession } from "@/lib/customer-auth";

export async function GET() {
  const store = await cookies();
  const session = await validSession(store);
  if (!session) {
    authDebug("orders-401-no-session", {});
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  try {
    const result = await orders(session.accessToken);
    if ("unauthorized" in result) {
      authDebug("orders-401-customer-api-unauthorized", {});
      clearSession(store);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json(result);
  } catch (error) {
    authDebug("orders-api-error", {
      reason: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json({ error: "Unable to load your orders." }, { status: 502 });
  }
}
