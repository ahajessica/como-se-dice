import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { word, fromLanguage, toLanguage } = await req.json();

  if (!word || !fromLanguage || !toLanguage) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to parse response", raw: text }, { status: 500 });
  }
}
