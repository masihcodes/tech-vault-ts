"use client";

import Link from 'next/link';
import { Compass, Layers, LogIn, LogOut, Radar, User2, UserStar } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { User } from './myTypes';
import { signOutAction } from '@/app/auth/action';
import { setSignInModalStatus } from './useLibStore';




export default function Navbar({ user }: { user: (User | null); }) {


  const path = usePathname();

  return (
    <nav className="sticky top-0 z-20 border-b border-slate-800 bg-slate-900/50 p-4 backdrop-blur-md">
      <div className="flex items-center justify-between ">
        <h1 className="flex flex-1 items-center justify-start gap-2 ml-5 text-2xl font-bold text-cyan-400">
          <Layers />
          DevStack<span className="text-slate-100">Vault</span>
        </h1>
        <div className="flex flex-1 items-center justify-center gap-10">
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
            href={user?.name ? "/mylib" : "#"}
            onClick={(e) => {
              if (!user?.name) {
                e.preventDefault();
                setSignInModalStatus(true);
              }
            }}
            className={
              path === '/mylib'
                ? 'flex items-center gap-1 font-medium text-cyan-400'
                : 'flex items-center gap-1 text-slate-400 transition hover:text-cyan-300'
            }>
            <Radar /> My Tech Radar
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end mr-5">
          {user?.name ?
            (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 px-4 py-2 border rounded-full border-slate-700/50 bg-slate-800/40 hover:shadow-lg hover:shadow-cyan-500/40">
                  {(user?.role === "admin") ? <UserStar /> : <User2 />}
                  <span className="text-md font-bold bg-linear-to-r from-slate-100 to-cyan-400 bg-clip-text text-transparent tracking-widest ">
                    {user?.name.toUpperCase()}
                  </span>
                  <span>{(user?.role === "admin") ? "(Admin)" : "(User)"}</span>
                  <span className={`h-3 w-3 rounded-full animate-ping ${user?.role === "admin" ? "bg-blue-800" : "bg-green-800"}`}></span>
                </div>


                <button
                  onClick={signOutAction}
                  className="group flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-md font-medium text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-400 hover:shadow-lg hover:shadow-rose-500/40 hover:rounded-full">
                  <LogOut className="transition-transform group-hover:-translate-x-0.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            )
            :
            (
              <p
                onClick={() => setSignInModalStatus(true)}
                className="flex items-center gap-3 text-slate-400 transition hover:text-cyan-300 cursor-pointer">
                <LogIn />Sign In
              </p>
            )}
        </div>

      </div>
    </nav >
  );
}