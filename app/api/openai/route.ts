import { NextRequest, NextResponse } from "next/server";
import { callOpenAI } from "./openai";

export const runtime="edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const completion = await callOpenAI(body.text);
    return NextResponse.json({ result: completion }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}