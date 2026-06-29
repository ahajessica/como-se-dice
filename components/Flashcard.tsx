"use client";

import { WordData } from "@/app/page";

type Props = {
  data: WordData;
  fromLang: string;
  toLang: string;
};

export default function Flashcard({ data, fromLang, toLang }: Props) {
  return (
    <div className="animate-fade-slide-up">
      <div className="relative rounded-3xl bg-white shadow-xl overflow-hidden border border-indigo-100">
        {/* Top accent bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <div className="p-8">
          {/* From/To labels */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">{fromLang}</span>
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-400">{toLang}</span>
          </div>

          {/* Word pair */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-2xl font-bold text-gray-400">{data.originalWord}</p>
            </div>
            <div className="text-3xl text-gray-300 select-none">→</div>
            <div className="text-right">
              <p className="text-5xl font-extrabold text-indigo-700 leading-tight">{data.translatedWord}</p>
              <p className="text-sm text-purple-500 font-medium mt-1 italic">{data.partOfSpeech}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-dashed border-gray-100" />

          {/* Synthetic Phonics */}
          <div className="text-center mb-5">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Sound it out</p>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {data.phonemes.map((phoneme, i) => (
                <span key={i} className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-xl font-bold text-white shadow-md min-w-[3rem]">
                    {phoneme}
                  </span>
                  {i < data.phonemes.length - 1 && (
                    <span className="text-indigo-300 font-bold text-lg">+</span>
                  )}
                </span>
              ))}
            </div>
            <p className="mt-3 text-2xl font-bold tracking-wide text-indigo-600">
              {data.simplePronounciation}
            </p>
          </div>

          {/* Syllable breakdown */}
          <div className="text-center mb-2">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Syllables</p>
            <div className="flex items-center justify-center gap-1 flex-wrap">
              {data.syllables.map((syllable, i) => (
                <span key={i} className="flex items-center gap-1">
                  <span className="inline-block rounded-xl bg-indigo-50 px-4 py-2 text-lg font-bold text-indigo-700 border border-indigo-100">
                    {syllable}
                  </span>
                  {i < data.syllables.length - 1 && (
                    <span className="text-indigo-300 font-bold text-xl">·</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Definition */}
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
            <p className="text-xs uppercase tracking-widest text-indigo-400 mb-1">Meaning</p>
            <p className="text-gray-700 text-sm leading-relaxed">{data.definition}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
