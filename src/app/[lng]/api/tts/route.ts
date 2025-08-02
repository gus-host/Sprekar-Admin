// app/api/tts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

type RequestBody = { text: string; voice?: string };

export async function POST(req: NextRequest) {
  const { text, voice = "alloy" } = (await req.json()) as RequestBody;
  if (!text) {
    return NextResponse.json({ error: "Missing `text`" }, { status: 400 });
  }

  try {
    const resp = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice, // now defaults to "alloy"
      input: text,
    });
    const buffer = Buffer.from(await resp.arrayBuffer());
    return new NextResponse(buffer, {
      status: 200,
      headers: { "Content-Type": "audio/wav" },
    });
  } catch (e: any) {
    console.error("TTS error:", e);
    const msg = e?.message || "TTS failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
