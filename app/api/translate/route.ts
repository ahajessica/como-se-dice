import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const { word, fromLanguage, toLanguage } = await req.json();

  if (!word || !fromLanguage || !toLanguage) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY is not configured" }, { status: 500 });
  }

  const prompt = `You are a language learning assistant. A ${fromLanguage} speaker wants to learn the ${toLanguage} word for "${word}".

Return a JSON object with exactly this structure:
{
  "originalWord": "${word}",
  "translatedWord": "<the ${toLanguage} translation>",
  "phonetics": "<IPA pronunciation, e.g. /ˈflaʊər/>",
  "syllables": ["<syllable1>", "<syllable2>", ...],
  "syllableBreakdown": "<hyphen-separated syllables, e.g. flow-er>",
  "partOfSpeech": "<noun|verb|adjective|adverb|etc>",
  "definition": "<short definition in ${fromLanguage}>",
  "exampleSentences": [
    { "sentence": "<example in ${toLanguage}>", "translation": "<translation in ${fromLanguage}>" },
    { "sentence": "<example in ${toLanguage}>", "translation": "<translation in ${fromLanguage}>" },
    { "sentence": "<example in ${toLanguage}>", "translation": "<translation in ${fromLanguage}>" }
  ],
  "similarSoundingWords": [
    { "word": "<word>", "phonetics": "<IPA>", "meaning": "<brief meaning in ${fromLanguage}>" },
    { "word": "<word>", "phonetics": "<IPA>", "meaning": "<brief meaning in ${fromLanguage}>" },
    { "word": "<word>", "phonetics": "<IPA>", "meaning": "<brief meaning in ${fromLanguage}>" }
  ],
  "tips": "<1-2 sentence memory tip or pronunciation tip in ${fromLanguage}>"
}

Only return valid JSON, no markdown, no extra text.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json({ error: `Anthropic API error ${response.status}: ${errText}` }, { status: 502 });
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
