'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Compass, Layers, LogIn, LogOut, Radar, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { clearAuthCredentials, getAuthCredentials } from './authStorage';

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const credentials = getAuthCredentials();
    setName(credentials?.name ?? null);
  }, [path]);

  function handleSignOut() {
    clearAuthCredentials();
    setName(null);
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/50 p-4 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold text-cyan-400">
          <Layers />
          DevStack<span className="text-slate-100">Vault</span>
        </h1>
        <div className="flex items-center gap-x-6">
          <Link
            href="/"
            className={
              path === '/'
                ? 'flex items-center gap-1 font-medium text-cyan-400'
                : 'flex items-center gap-1 text-slate-400 transition hover:text-cyan-300'
            }>
            <Compass />
            Explore
          </Link>
          <Link
            href="/mylib"
            className={
              path === '/mylib'
                ? 'flex items-center gap-1 font-medium text-cyan-400'
                : 'flex items-center gap-1 text-slate-400 transition hover:text-cyan-300'
            }>
            <Radar /> My Tech Radar
          </Link>
        </div>

        <div className="flex items-center gap-x-6">
          {name ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-4 px-4 py-2 border rounded-full border-slate-700/50 bg-slate-800/40 hover:shadow-lg hover:shadow-cyan-500/40 ">
                <span className="text-md font-bold bg-linear-to-r from-slate-100 to-cyan-400 bg-clip-text text-transparent tracking-widest ">
                  {name.toUpperCase()}
                </span>
                <span className="h-2 w-2 rounded-full animate-ping bg-green-300"></span>
              </div>


              <button
                onClick={handleSignOut}
                className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-md font-medium text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-400 hover:shadow-lg hover:shadow-rose-500/40 hover:rounded-full"
              >
                <LogOut className="transition-transform group-hover:-translate-x-0.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/sign-in"
                className={
                  path === '/sign-in'
                    ? 'flex items-center gap-1 font-medium text-cyan-400'
                    : 'flex items-center gap-1 text-slate-400 transition hover:text-cyan-300'
                }>
                <LogIn />
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className={
                  path === '/sign-up'
                    ? 'flex items-center gap-1 font-medium text-cyan-400'
                    : 'flex items-center gap-1 text-slate-400 transition hover:text-cyan-300'
                }>
                <UserPlus />
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav >
  );
}
