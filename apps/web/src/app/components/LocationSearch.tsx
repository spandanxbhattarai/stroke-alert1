"use client";

import { useState } from "react";

interface Props {
  onSearch: (city: string) => void;
}

export default function LocationSearch({ onSearch }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter city name (e.g. Kathmandu)"
        className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-red-500"
        aria-label="Search by city name"
      />
      <button
        type="submit"
        className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-3 rounded-xl transition-colors"
        aria-label="Search hospitals"
      >
        Search
      </button>
    </form>
  );
}
