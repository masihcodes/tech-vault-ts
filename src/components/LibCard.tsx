"use client";


import { useTransition } from 'react';
import { Bookmark, BookmarkPlus, Box, Loader, ShieldCheck, SquareArrowOutUpRight } from 'lucide-react';
import { setBadgeModalStatus, setLibInfo, setModalStatus, setNewEntryStatus, setSignInModalStatus, setTarget } from './useLibStore';
import { isBookmarkedAction } from '@/app/action';
import { toast } from 'sonner';
import { LibraryItem, User } from './myTypes';





export default function LibCard({ lib, user }: { lib: LibraryItem; user: (User | null); }) {




  const [pending, startTransition] = useTransition();

  function handleBookmark(lib: LibraryItem) {
    if (!user) {
      setSignInModalStatus(true);
    } else {
      startTransition(async () => {
        const res = await isBookmarkedAction(lib.id);
        if (res.success) {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      });
    }
  }




  function handleDetails(lib: LibraryItem) {
    if (!user) {
      setSignInModalStatus(true);
    } else {
      setModalStatus(true);
      setTarget(lib);
      setNewEntryStatus(false);
    }
  }



  const statusStyles = {
    pending: "text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.15)]",
    private: "text-slate-400 border-slate-600 bg-slate-800/80 hover:bg-slate-700",
    public: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
  };
  const currentStyle = statusStyles[lib.status];


  return (
    <div className="group flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 transition-all duration-500 hover:scale-105 hover:border-cyan-500/90 hover:bg-slate-800 hover:shadow-lg hover:shadow-cyan-500/40">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all hover:bg-cyan-500/20">
            {lib.category}
          </span>
          <span
            onClick={() => {
              if (user?.role === "admin") {
                setBadgeModalStatus(true);
                setLibInfo(lib);
              } else {
                toast.error("Only admin can change badge status.");
              }
            }}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide uppercase transition-all ${currentStyle}`}>
            {lib.status}
            {lib.isProtected ? <ShieldCheck className="h-4 w-4" /> : ""}
          </span>
        </div>
        <div className="flex items-center gap-2 text-white transition-colors group-hover:text-cyan-400">
          <Box className="h-5 w-5" />
          <h3 className="text-xl font-extrabold">{lib.name}</h3>
        </div>
      </div>

      <p className="mb-6 grow text-justify text-sm leading-relaxed text-slate-400">
        {lib.description}
      </p>

      <div className="flex w-full shadow-sm">
        <button
          onClick={() => handleDetails(lib)}
          className="flex flex-1 items-center justify-center gap-2 rounded-l-lg border border-r-0 border-slate-600 bg-slate-800 py-2.5 font-medium text-cyan-400 transition-colors hover:bg-slate-700 hover:text-white">
          View Details <SquareArrowOutUpRight className="h-4 w-4" />
        </button>

        <button
          onClick={() => handleBookmark(lib)}
          disabled={pending}
          className="group/save flex items-center justify-center rounded-r-lg border border-slate-600 bg-slate-800 px-4 text-cyan-400 transition-colors hover:bg-slate-700 hover:text-white">
          {pending ? (<Loader className="animate-spin" />) : (((lib.isBookmarked) ?
            <BookmarkPlus className="group-hover/save:scale-110 transition-transform" />
            :
            <Bookmark className="group-hover/save:scale-110 transition-transform" />))}
        </button>
      </div>
    </div>
  );
}