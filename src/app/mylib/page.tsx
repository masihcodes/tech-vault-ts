import { Activity, Database, LogIn } from 'lucide-react';

import { getBookmarkedLibs, getSessionUser } from '@/components/neon';
import MyLibs from '@/components/MyLibs';
import Link from 'next/link';





export default async function myLib() {


  const user = await getSessionUser();

  if (!user) return (
    <main className="mx-auto mt-10 max-w-lg p-4 text-center">
      <LogIn className="mx-auto mb-4 h-12 w-12 text-cyan-400" />
      <h2 className="mb-2 text-2xl font-bold text-white">Sign in required</h2>
      <p className="mb-6 text-slate-400">
        Please sign in to view and manage your bookmarked libraries.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white shadow-lg shadow-cyan-500/40 transition hover:bg-cyan-500">
        <LogIn className="h-4 w-4" />
        Sign In
      </Link>
    </main>
  );



  const myLibs = await getBookmarkedLibs(user.id);



  return (

    <main className=" mx-auto p-4 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-800 pb-6 gap-4">
        <div>
          <h2 className="text-5xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-cyan-500" /> My Tech Radar
          </h2>
          <p className="text-slate-400 mt-2 text-lg">Libraries and tools marked for learning or daily use</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-lg flex items-center gap-2">
          <Database className=" text-cyan-400" />
          <span className="text-sm font-semibold text-slate-200">{myLibs.length} Items Saved</span>
        </div>
      </div>

      <MyLibs myLibs={myLibs} />
    </main>
  );
}