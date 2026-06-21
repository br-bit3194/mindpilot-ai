import { NextRequest, NextResponse } from "next/server";
import { analyzeJournal } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }
    const result = await analyzeJournal(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
