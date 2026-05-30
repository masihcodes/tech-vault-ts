'use client';
import { personalNoteAction, removeFromMyLibAction } from '@/app/mylib/action';
import { BookOpen, Copy, Edit3, ExternalLink, FileText, Info, Loader, Tag, Terminal, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { LibraryItem } from './myTypes';





export default function MyLibCard({ item }: { item: LibraryItem; }) {



  const [delPending, startDelTransition] = useTransition();

  function handleRemove(item: LibraryItem) {

    startDelTransition(async () => {
      const res = await removeFromMyLibAction(item);
      if (res.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    });
  }




  const [notePending, startNoteTransition] = useTransition();
  const [note, setNote] = useState(item.personalNote || '');

  function handleSave(item: LibraryItem) {
    const updatedItem = { ...item, personalNote: note };

    startNoteTransition(async () => {
      const res = await personalNoteAction(updatedItem);
      if (res.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    });
  }





  return (
    <>
      <div className='mb-8 flex items-center justify-between gap-4'>
        <h2 className='text-5xl font-extrabold tracking-tight text-white md:text-3xl'>{item.name}</h2>
        <span className='flex items-center gap-1 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400'>
          <Tag className='h-3 w-3' /> {item.category}
        </span>
      </div>

      <div className='relative mx-auto mb-8 w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/30 p-8'>
        <h3 className='mb-4 flex items-center gap-2 text-xl font-bold text-white'>
          <Info className='text-cyan-400' /> What problem does it solve?
        </h3>

        <p className='mb-8 text-justify text-base leading-relaxed text-slate-300'>{item.description}</p>

        <div className='flex flex-col justify-between gap-5 lg:flex-row'>
          <div className='flex-1'>
            <h3 className='mb-4 flex items-center gap-2 text-xl font-bold text-white'>
              <Terminal className='text-slate-400' /> Installation
            </h3>
            <div className='group/copy flex cursor-copy items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 transition-colors hover:border-cyan-500/50'>
              <code className='text-sm text-cyan-400 transition-colors group-hover/copy:text-cyan-300'>
                {item.installCommand}
              </code>
              <button className='text-slate-500 transition-colors hover:text-cyan-400'>
                <Copy className='h-5 w-5' />
              </button>
            </div>
          </div>

          <div className='flex flex-1 flex-col'>
            <h3 className='mb-4 flex items-center gap-2 text-xl font-bold text-white'>
              <BookOpen className='text-cyan-400' /> Official Documentation
            </h3>
            <a
              className='flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 font-medium text-cyan-400 transition-colors hover:border-cyan-500 hover:bg-slate-800'
              target='_blank'
              rel='noreferrer'
              href={item.docsUrl}>
              <span className='truncate'>{item.docsUrl}</span>
              <ExternalLink className='shrink-0' />
            </a>
          </div>
        </div>
      </div>

      <div className='mt-auto flex flex-col items-start justify-between gap-6 md:flex-row md:items-center'>
        <div className='relative w-full rounded-xl border border-slate-700 bg-slate-900/60 p-4'>
          <div className='absolute -left-1 top-4 h-8 w-2 rounded-r-md bg-cyan-500'></div>
          <span className='mb-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-400'>
            <FileText /> My Note
          </span>
          <textarea
            onChange={(e) => setNote(e.target.value)}
            defaultValue={item.personalNote || ''}
            className='mt-1 h-16 w-full resize-none bg-transparent text-sm text-slate-300 focus:outline-none'
            placeholder='Write your note here...'>
          </textarea>
        </div>

        <div className='mt-4 flex w-full shrink-0 flex-row gap-2 md:mt-0 md:w-auto md:flex-col'>
          <button
            onClick={() => { handleSave(item); }}
            className='w-full md:w-40 bg-cyan-600/20 text-cyan-400 px-4 py-2 rounded-lg border border-cyan-600/30 hover:bg-cyan-600/30 transition text-sm font-medium flex justify-center items-center gap-2'
            disabled={notePending}>
            {notePending ? <Loader className='animate-spin' /> : <Edit3 className='w-4 h-4' />} Save Note
          </button>

          <button
            onClick={() => { handleRemove(item); }}
            className='w-full md:w-40 bg-red-500/10 text-red-400 px-4 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition text-sm font-medium flex justify-center items-center gap-2'
            disabled={delPending}>
            {delPending ? <Loader className='animate-spin' /> : <Trash2 className='w-4 h-4' />} Remove
          </button>
        </div>
      </div>
    </>
  );
}
