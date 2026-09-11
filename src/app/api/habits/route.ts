import { NextResponse } from "next/server";
import { demoStore } from "@/lib/demo-store";
import { errorResponse, getSessionId } from "@/lib/http";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return NextResponse.json({ habits: demoStore.habits(getSessionId(request)) });
}

export async function PATCH(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== "string") return errorResponse("A habit id is required.", 400);
  const habit = demoStore.toggleHabit(getSessionId(request), body.id);
  if (!habit) return errorResponse("Habit not found.", 404);
  return NextResponse.json({ habit });
}
