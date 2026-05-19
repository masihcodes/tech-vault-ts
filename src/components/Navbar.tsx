"use client";

import Link from 'next/link';
import { Compass, Layers, Radar } from 'lucide-react';
import { usePathname } from 'next/navigation';




export default function Navbar() {

  const path = usePathname();

  return (
    <nav className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-cyan-400">
          <Layers />
          DevStack<span className="text-slate-100">Vault</span>
        </h1>
        <div className="space-x-6 flex items-center">
          <Link href="/" className={
            (path === "/") ? "text-cyan-400 font-medium flex items-center gap-1" : "text-slate-400 hover:text-cyan-300 transition flex items-center gap-1"}>
            <Compass />Explore
          </Link>
          <Link href="/mylib" className={
            (path === "/mylib") ? "text-cyan-400 font-medium flex items-center gap-1" : "text-slate-400 hover:text-cyan-300 transition flex items-center gap-1"}>
            <Radar /> My Tech Radar
          </Link>
        </div>
      </div>
    </nav>
  );
}