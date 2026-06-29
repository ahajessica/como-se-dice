"use client";

import { useState, FormEvent } from "react";
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
  const [word, setWord] = useState("");
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!word.trim() || loading) return;
    setLoading(true);
    setError(null);
    setFlipped(false);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, fromLanguage: fromLang, toLanguage: toLang }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? `Server error ${res.status}`);
      setWordData(data);
      setTimeout(() => setFlipped(true), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFlipped(false);
    setTimeout(() => {
      setWordData(null);
      setWord("");
      setError(null);
    }, 400);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 flex flex-col items-center px-4 py-12">
      {/* Title */}
      <h1 className="text-3xl font-bold text-indigo-700 mb-2 tracking-tight">¿Cómo se dice?</h1>
      <p className="text-gray-400 text-sm mb-8">Create a flashcard to learn a new word</p>

      {/* Flip card */}
      <div className="w-full max-w-lg" style={{ perspective: "1200px" }}>
        <div
          className="relative w-full transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            minHeight: "420px",
          }}
        >
          {/* FRONT — blank card / input */}
          <div
            className="absolute inset-0 rounded-3xl bg-white shadow-2xl border border-indigo-100 overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            <div className="p-8 flex flex-col h-full">
              {/* Language selectors */}
              <div className="flex items-center gap-3 mb-8 flex-wrap">
                <select
                  value={fromLang}
                  onChange={(e) => setFromLang(e.target.value)}
                  className="flex-1 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
                <span className="text-xl text-gray-300 select-none">→</span>
                <select
                  value={toLang}
                  onChange={(e) => setToLang(e.target.value)}
                  className="flex-1 rounded-xl border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>

              {/* Card writing area */}
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 gap-4">
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <p className="text-xs uppercase tracking-widest text-gray-300">Write a word to learn</p>
                  <input
                    type="text"
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    placeholder={`e.g. flor`}
                    disabled={loading}
                    autoFocus
                    className="w-full text-center text-4xl font-bold text-indigo-700 placeholder:text-indigo-200 bg-transparent border-b-2 border-dashed border-indigo-200 focus:border-indigo-400 focus:outline-none pb-2 transition-colors"
                  />
                  <p className="text-xs text-gray-300">in {fromLang} → learn in {toLang}</p>
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !word.trim()}
                  className="w-full rounded-2xl bg-indigo-600 py-4 text-white font-semibold text-base shadow-lg hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      Creating your flashcard…
                    </>
                  ) : (
                    <>✦ Create Flashcard</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* BACK — filled card */}
          <div
            className="absolute inset-0 rounded-3xl bg-white shadow-2xl border border-indigo-100 overflow-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500" />
            {wordData && (
              <div className="p-8 flex flex-col gap-5 h-full overflow-y-auto">
                {/* Labels */}
                <div className="flex justify-between text-xs font-semibold uppercase tracking-widest">
                  <span className="text-indigo-300">{fromLang}</span>
                  <span className="text-purple-300">{toLang}</span>
                </div>

                {/* Word pair */}
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xl font-bold text-gray-300">{wordData.originalWord}</p>
                  <span className="text-gray-200 text-2xl">→</span>
                  <div className="text-right">
                    <p className="text-5xl font-extrabold text-indigo-700 leading-tight">{wordData.translatedWord}</p>
                    <p className="text-sm text-purple-400 italic mt-1">{wordData.partOfSpeech}</p>
                  </div>
                </div>

                <div className="border-t border-dashed border-gray-100" />

                {/* Phoneme tiles */}
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-300 mb-3">Sound it out</p>
                  <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                    {wordData.phonemes.map((phoneme, i) => (
                      <span key={i} className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-xl font-bold text-white shadow-md min-w-[3rem]">
                          {phoneme}
                        </span>
                        {i < wordData.phonemes.length - 1 && (
                          <span className="text-indigo-300 font-bold text-lg">+</span>
                        )}
                      </span>
                    ))}
                  </div>
                  <p className="text-2xl font-bold tracking-wide text-indigo-600">
                    {wordData.simplePronounciation}
                  </p>
                </div>

                {/* Syllables */}
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-300 mb-2">Syllables</p>
                  <div className="flex items-center justify-center gap-1 flex-wrap">
                    {wordData.syllables.map((s, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="rounded-xl bg-indigo-50 px-4 py-2 text-lg font-bold text-indigo-700 border border-indigo-100">
                          {s}
                        </span>
                        {i < wordData.syllables.length - 1 && (
                          <span className="text-indigo-300 font-bold text-xl">·</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Definition */}
                <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
                  <p className="text-xs uppercase tracking-widest text-indigo-400 mb-1">Meaning</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{wordData.definition}</p>
                </div>

                {/* New card button */}
                <button
                  onClick={handleReset}
                  className="mt-auto w-full rounded-2xl border-2 border-dashed border-indigo-200 py-3 text-indigo-400 text-sm font-semibold hover:border-indigo-400 hover:text-indigo-600 transition"
                >
                  + New flashcard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Word details below card */}
      {wordData && flipped && (
        <div className="w-full max-w-lg mt-8 pb-20 space-y-6 animate-fade-slide-up">
          <WordDetails data={wordData} fromLang={fromLang} toLang={toLang} />
        </div>
      )}
    </main>
  );
}
