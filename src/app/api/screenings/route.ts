import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { errorResponse, getSessionId } from "@/lib/http";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return NextResponse.json({ screenings: demoStore.screenings(getSessionId(request)) });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !Number.isFinite(body.score) || !Number.isFinite(body.maxScore)) return errorResponse("Invalid screening result.", 400);
  const screening = demoStore.addScreening(getSessionId(request), { id: crypto.randomUUID(), title: body.title, score: body.score, maxScore: body.maxScore, statusLabel: typeof body.statusLabel === "string" ? body.statusLabel : "Completed", createdAt: new Date().toISOString() });
  return NextResponse.json({ screening }, { status: 201 });
}
