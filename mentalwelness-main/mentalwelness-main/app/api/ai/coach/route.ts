import { NextRequest, NextResponse } from "next/server";
import { getWellnessCoachResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { history, message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    const response = await getWellnessCoachResponse(history ?? [], message);
    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ error: "Coach response failed" }, { status: 500 });
  }
}
