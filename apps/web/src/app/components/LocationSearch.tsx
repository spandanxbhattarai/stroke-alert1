"use client";

import { useState } from "react";
import { Button } from "./ui/Button";
import { SearchIcon } from "./ui/Icons";

export default function LocationSearch({ onSearch }: { onSearch: (city: string) => void }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div className="flex-1">
        <label htmlFor="city-search" className="label mb-1.5 block">
          Search by city
        </label>
        <input
          id="city-search"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Kathmandu"
          className="field text-body-l"
        />
      </div>
      <Button type="submit" variant="ink" size="md" icon={<SearchIcon className="h-4 w-4" />}>
        Search
      </Button>
    </form>
  );
}
