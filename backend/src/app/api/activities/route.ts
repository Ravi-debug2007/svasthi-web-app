import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { errorResponse, getSessionId } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.type !== "string" || !body.type.trim()) return errorResponse("An activity type is required.", 400);
  return NextResponse.json({ activity: demoStore.addActivity(getSessionId(request), body.type.trim()) }, { status: 201 });
}
