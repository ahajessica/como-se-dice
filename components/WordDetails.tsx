"use client";

import { WordData } from "@/app/page";

type Props = {
  data: WordData;
  fromLang: string;
  toLang: string;
};

export default function WordDetails({ data, fromLang, toLang }: Props) {
  return (
    <div className="space-y-6">
      {/* Example sentences */}
      <section className="animate-fade-slide-up delay-100 rounded-3xl bg-white border border-indigo-100 shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100">
          <h2 className="font-bold text-indigo-700 text-sm uppercase tracking-widest">Example Sentences</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {data.exampleSentences.map((ex, i) => (
            <div key={i} className="px-6 py-4">
              <p className="font-semibold text-gray-800 text-base">{ex.sentence}</p>
              <p className="text-gray-400 text-sm mt-1 italic">{ex.translation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Similar-sounding words */}
      <section className="animate-fade-slide-up delay-200 rounded-3xl bg-white border border-indigo-100 shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
          <h2 className="font-bold text-purple-700 text-sm uppercase tracking-widest">
            Sounds Like…
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Words that sound similar — be careful!</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-100">
          {data.similarSoundingWords.map((w, i) => (
            <div key={i} className="bg-white px-5 py-4">
              <p className="text-xl font-bold text-purple-700">{w.word}</p>
              <p className="text-sm font-mono text-gray-400 mt-0.5">{w.phonetics}</p>
              <p className="text-sm text-gray-600 mt-2">{w.meaning}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tip */}
      {data.tips && (
        <section className="animate-fade-slide-up delay-300 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 shadow-md p-6 flex gap-4">
          <span className="text-3xl">💡</span>
          <div>
            <h2 className="font-bold text-amber-700 text-sm uppercase tracking-widest mb-1">Memory Tip</h2>
            <p className="text-gray-700 text-sm leading-relaxed">{data.tips}</p>
          </div>
        </section>
      )}
    </div>
  );
}
