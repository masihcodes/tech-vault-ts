"use client";
import { ChevronDown, Search } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useRef } from 'react';


export default function FilterBar() {

  const router = useRouter();
  const path = usePathname();
  const urlParams = useSearchParams();

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleSearch = (text: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      router.replace(`/?q=${text}`);
    }, 500);
  };

  const currentSort = urlParams.get("sort") || "asc";

  function handleSort(text: string) {

    const params = new URLSearchParams(urlParams.toString());
    params.set("sort", text);
    router.replace(`${path}?${params.toString()}`);
  }


  return (
    <div className="flex flex-2 w-full sm:w-auto flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800/50 transition-all focus-within:border-cyan-500 focus-within:ring-1 focus-within:ring-cyan-500 sm:flex-row">

      <div className="relative flex-3 border-b border-slate-700 sm:border-b-0 sm:border-r">
        <Search className="absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="e.g., Zustand, Tailwind..."
          // onChange={(e) => router.replace(`/?q=${e.target.value}`)}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full bg-transparent py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      <div className="relative flex-2 bg-slate-900/30 transition-colors hover:bg-slate-800">
        <select
          onChange={(e) => handleSort(e.target.value)}
          value={currentSort}
          className="w-full cursor-pointer appearance-none bg-transparent py-3.5 pl-4 pr-10 text-white focus:outline-none">
          <option value="asc">Oldest First</option>
          <option value="des">Newest First</option>
          <option value="name">Name</option>
        </select>

        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
          <ChevronDown className="h-5 w-5" />
        </div>
      </div>

    </div>
  );
}