"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Flashcard from "@/components/Flashcard";
import WordDetails from "@/components/WordDetails";

export type WordData = {
  originalWord: string;
  translatedWord: string;
  phonemes: string[];
  simplePronounciation: string;
  syllables: string[];
  syllableBreakdown: string;
  partOfSpeech: string;
  definition: string;
  exampleSentences: { sentence: string; translation: string }[];
  similarSoundingWords: { word: string; phonemes: string[]; meaning: string }[];
  tips: string;
};

const LANGUAGES = [
  { code: "Spanish", label: "Español" },
  { code: "English", label: "English" },
  { code: "French", label: "Français" },
  { code: "Portuguese", label: "Português" },
  { code: "Italian", label: "Italiano" },
  { code: "German", label: "Deutsch" },
  { code: "Mandarin", label: "中文" },
  { code: "Japanese", label: "日本語" },
];

export default function Home() {
  const [fromLang, setFromLang] = useState("Spanish");
  const [toLang, setToLang] = useState("English");
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (word: string) => {
    if (!word.trim()) return;
    setLoading(true);
    setError(null);
    setWordData(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, fromLanguage: fromLang, toLanguage: toLang }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `Server error ${res.status}`);
      setWordData(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="pt-12 pb-6 text-center px-4">
        <h1 className="text-4xl font-bold tracking-tight text-indigo-700">
          ¿Cómo se dice?
        </h1>
        <p className="mt-2 text-gray-500 text-sm">
          Type a word in your language and learn how to say it in another
        </p>
      </header>

      {/* Language selector */}
      <div className="flex items-center justify-center gap-3 px-4 mb-6 flex-wrap">
        <select
          value={fromLang}
          onChange={(e) => setFromLang(e.target.value)}
          className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>

        <span className="text-2xl select-none">→</span>

        <select
          value={toLang}
          onChange={(e) => setToLang(e.target.value)}
          className="rounded-xl border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto px-4 mb-10">
        <SearchBar onSearch={handleSearch} loading={loading} placeholder={`Type a word in ${fromLang}…`} />
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-xl mx-auto px-4 mb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Results */}
      {wordData && (
        <div className="max-w-2xl mx-auto px-4 pb-20 space-y-8">
          <Flashcard data={wordData} fromLang={fromLang} toLang={toLang} />
          <WordDetails data={wordData} fromLang={fromLang} toLang={toLang} />
        </div>
      )}
    </main>
  );
}
