'use client';

import { useActionState, useEffect, useTransition } from 'react';
import { LibraryBig, Link, Loader, PackageX, Save, Terminal, X } from 'lucide-react';
import { resetTarget, setModalStatus, useLibStore } from './useLibStore';
import { createLibAction, removeLibAction, updateLibAction } from '../app/action';
import { toast } from 'sonner';
import { ActionResponse } from './myTypes';




export default function Modal() {


  const modalStatus = useLibStore((s) => s.modalStatus);
  const target = useLibStore((s) => s.target);
  const newEntryStatus = useLibStore((s) => s.newEntryStatus);



  const formActionWrapper = async (prevState: ActionResponse | null, formData: FormData) => {
    if (newEntryStatus) {
      return createLibAction(prevState, formData);
    } else {
      return updateLibAction(target, prevState, formData);
    }
  };

  const [state, formAction, pending] = useActionState<ActionResponse | null, FormData>(formActionWrapper, null);




  const [delPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const res = await removeLibAction(target.id);
      if (res.success) {
        toast.success(res?.message);
      } else {
        toast.error(res?.message);
      }
    });
    setModalStatus(false);
    resetTarget();
  }



  useEffect(() => {
    if (state && state.success) {
      setModalStatus(false);
      resetTarget();
      toast.success(state.message);
    }
    if (state && !state.success) {
      toast.error(state.message);
    }
  }, [state]);






  return (
    <>
      {modalStatus && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm'>
          <div className='relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-900/20'>
            <div className='flex shrink-0 items-center justify-between border-b border-slate-800 p-6'>
              <h3 className='flex items-center gap-2 text-xl font-bold text-white'>
                <LibraryBig className='text-cyan-400' />
                {target.name ? 'Change Your Library' : 'Add New Library'}
              </h3>
              <button
                className='text-slate-400 transition-colors hover:text-white'
                onClick={() => {
                  setModalStatus(false);
                  resetTarget();
                }}>
                <X />
              </button>
            </div>

            <form action={formAction} className='space-y-4 overflow-y-auto p-6'>
              <label className='mb-1 block text-sm font-medium text-slate-400'>
                Library Name
                <input
                  type='text'
                  name='name'
                  className='mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white transition-colors focus:border-cyan-500 focus:outline-none'
                  defaultValue={target.name}
                  placeholder='e.g., Framer Motion'
                />
              </label>

              <label className='mb-1 block text-sm font-medium text-slate-400'>
                Category
                <select
                  name='category'
                  defaultValue={target.category}
                  className='mt-1 w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-white transition-colors focus:border-cyan-500 focus:outline-none'>
                  <option>UI Components</option>
                  <option>State Management</option>
                  <option>Data Fetching</option>
                  <option>Animation</option>
                  <option>Routing</option>
                </select>
              </label>

              <label className='mb-1 block text-sm font-medium text-slate-400'>
                Description
                <textarea
                  name='description'
                  defaultValue={target.description}
                  rows={4}
                  placeholder='What problem does it solve?'
                  className='mt-1 w-full resize-none rounded-lg border border-slate-700 bg-slate-950 p-3 text-white transition-colors focus:border-cyan-500 focus:outline-none'></textarea>
              </label>

              <label className='mb-1 block text-sm font-medium text-slate-400'>
                Install Command
                <div className='relative mt-1'>
                  <Terminal className='absolute left-3 top-3.5 text-slate-500' />
                  <input
                    name='installCommand'
                    defaultValue={target.installCommand}
                    type='text'
                    placeholder='npm install ....'
                    className='w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-10 pr-3 font-mono text-sm text-cyan-400 transition-colors focus:border-cyan-500 focus:outline-none'
                  />
                </div>
              </label>

              <label className='mb-1 block text-sm font-medium text-slate-400'>
                Documentation URL
                <div className='relative mt-1'>
                  <Link className='absolute left-3 top-3 text-slate-500' />
                  <input
                    name='docsUrl'
                    defaultValue={target.docsUrl}
                    type='text'
                    placeholder='https://...'
                    className='w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-3 text-sm text-white transition-colors focus:border-cyan-500 focus:outline-none'
                  />
                </div>
              </label>

              <div className='mt-10 flex flex-col items-center justify-center gap-5 border-t border-slate-800 pt-5 sm:flex-row'>
                <button
                  type='button'
                  onClick={() => {
                    setModalStatus(false);
                    resetTarget();
                  }}
                  className='rounded-lg px-5 py-2.5 font-medium text-slate-300 transition-colors hover:bg-slate-800'>
                  Cancel
                </button>

                {!newEntryStatus && (
                  <button
                    type='button'
                    onClick={handleDelete}
                    disabled={delPending}
                    className='flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-rose-500/40 transition-all hover:bg-rose-500 disabled:opacity-75'>
                    <PackageX /> Delete {delPending && <Loader className='animate-spin' />}
                  </button>
                )}

                <button
                  type='submit'
                  disabled={pending}
                  className='flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-cyan-500/40 transition-all hover:bg-cyan-500 disabled:opacity-75'>
                  <Save /> Save to Database {pending && <Loader className='animate-spin' />}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
