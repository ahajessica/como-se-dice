"use client";

import { useState, FormEvent } from "react";

type Props = {
  onSearch: (word: string) => void;
  loading: boolean;
  placeholder?: string;
};

export default function SearchBar({ onSearch, loading, placeholder = "Type a word…" }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={loading}
        className="flex-1 rounded-2xl border border-indigo-200 bg-white px-5 py-3 text-base shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading
          </span>
        ) : "Search"}
      </button>
    </form>
  );
}
