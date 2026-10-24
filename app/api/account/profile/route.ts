import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { authDebug, clearSession, profile, validSession } from "@/lib/customer-auth";

export async function GET() {
  const store = await cookies();
  const session = await validSession(store);
  if (!session) {
    authDebug("profile-401-no-session", {});
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  try {
    const result = await profile(session.accessToken);
    if ("unauthorized" in result) {
      authDebug("profile-401-customer-api-unauthorized", {});
      clearSession(store);
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json(result);
  } catch (error) {
    authDebug("profile-api-error", {
      reason: error instanceof Error ? error.name : "unknown",
    });
    return NextResponse.json({ error: "Unable to load your profile." }, { status: 502 });
  }
}
