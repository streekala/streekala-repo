import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validSession } from "@/lib/customer-auth";

export async function GET() {
  return NextResponse.json({ authenticated: Boolean(await validSession(await cookies())) });
}
