import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const essay = typeof body.essay === "string" ? body.essay.trim() : "";

    if (!essay) {
      return NextResponse.json(
        { error: "Please provide an essay to correct." },
        { status: 400 },
      );
    }

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen3.5:9b",
        prompt: `You are an English correction assistant.

Correct the following English sentence.

Return ONLY valid JSON in this exact format:

{
  "original": "original sentence",
  "corrected": "corrected sentence",
  "corrections": [
    {
      "original": "incorrect part",
      "corrected": "corrected part",
      "explanation": "explanation in Japanese",
      "type": "grammar"
    }
  ],
  "explanation": "overall explanation in Japanese",
  "naturalExpression": "a more natural English expression"
}

Rules:
- Always provide a value for every field.
- Keep original exactly as the user's input.
- corrections must contain every important correction.
- type must be either "grammar", "vocabulary", or "naturalness".
- Distinguish grammar/vocabulary errors from optional naturalness improvements.
- Do not change an expression merely because another expression sounds more natural.
- Only make a correction when there is a grammatical, vocabulary, or naturalness reason.
- Explain corrections in Japanese.
- If there are no corrections, return an empty corrections array.
- Always provide a naturalExpression. If the original is already natural, provide an alternative natural expression.
- Return ONLY valid JSON. Do not use Markdown or code blocks.

English sentence:
${body.essay}`,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      result: data.response,
    });
  } catch (error) {
    console.error("Ollama API error:", error);

    return NextResponse.json(
      {
        error: "AI correction failed.",
      },
      { status: 500 }
    );
  }
}