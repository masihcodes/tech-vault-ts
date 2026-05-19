"use client";


import { useTransition } from 'react';
import { Bookmark, BookmarkPlus, Box, Loader, SquareArrowOutUpRight } from 'lucide-react';
import { LibraryItem, setModalStatus, setNewEntryStatus, setTarget } from './useLibStore';
import { isBookmarkedAction } from '@/app/action';
import { toast } from 'sonner';




export default function LibCard({ lib }: { lib: LibraryItem; }) {


  const [pending, startTransition] = useTransition();
  function handleBookmark(lib: LibraryItem) {
    startTransition(async () => {
      const res = await isBookmarkedAction(lib);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    });
  }




  return (
    <div className="group flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/30 p-6 transition-all duration-500 hover:scale-105 hover:border-cyan-500/90 hover:bg-slate-800 hover:shadow-lg hover:shadow-cyan-500/40">
      <div className="mb-4 flex flex-col gap-2">
        <span className="self-end rounded-full border border-slate-500 bg-slate-700/50 px-2 py-1 text-[0.55rem] text-slate-300">
          {lib.category}
        </span>
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
          onClick={() => {
            setModalStatus(true);
            setTarget(lib);
            setNewEntryStatus(false);
          }}
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