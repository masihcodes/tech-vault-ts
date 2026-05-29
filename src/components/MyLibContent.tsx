'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Activity, Database, LogIn } from 'lucide-react';
import { getBookmarkedLibsAction } from '@/app/auth/action';
import { getAuthCredentials } from '@/components/authStorage';
import MyLibs from '@/components/MyLibs';
import { LibraryItem, useLibStore } from '@/components/useLibStore';

export default function MyLibContent() {
  const [myLibs, setMyLibs] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = useLibStore(s => s.isAuthenticated);
  const refreshMyLibTrigger = useLibStore(s => s.refreshMyLibTrigger);

  useEffect(() => {
    let cancelled = false;

    async function loadMyLibs() {
      setLoading(true);
      const credentials = getAuthCredentials();

      if (!credentials) {
        if (!cancelled) {
          setMyLibs([]);
          setLoading(false);
        }
        return;
      }

      try {
        const data = await getBookmarkedLibsAction(credentials);
        if (!cancelled) setMyLibs(data);
      } catch {
        if (!cancelled) setMyLibs([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (isAuthenticated) {
      loadMyLibs();
    }

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, refreshMyLibTrigger]);

  if (loading) {
    return <div className="animate-pulse py-12 text-center text-cyan-500">Loading ... ⏳</div>;
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto mt-10 max-w-lg p-4 text-center">
        <LogIn className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
        <h2 className="mb-2 text-2xl font-bold text-white">Sign in required</h2>
        <p className="mb-6 text-slate-400">
          Please sign in to view and manage your bookmarked libraries.
        </p>
        <Link
          href="/sign-in"
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white shadow-lg shadow-cyan-500/40 transition hover:bg-cyan-500">
          <LogIn className="h-4 w-4" />
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-10 p-4">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-slate-800 pb-6 md:flex-row md:items-end">
        <div>
          <h2 className="flex items-center gap-3 text-5xl font-extrabold tracking-tight text-white">
            <Activity className="h-8 w-8 text-cyan-500" /> My Tech Radar
          </h2>
          <p className="mt-2 text-lg text-slate-400">
            Libraries and tools marked for learning or daily use
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2">
          <Database className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">{myLibs.length} Items Saved</span>
        </div>
      </div>

      <MyLibs myLibs={myLibs} />
    </main>
  );
}
