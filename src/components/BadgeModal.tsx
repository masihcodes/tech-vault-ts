"use client";

import { X, Settings } from 'lucide-react';
import { resetLibInfo, setBadgeModalStatus, useLibStore } from './useLibStore';
import { setBadgeAction } from '@/app/action';
import { toast } from 'sonner';





export default function BadgeModal() {


  const badgeModalStatus = useLibStore((s) => s.badgeModalStatus);
  const libInfo = useLibStore((s) => s.libInfo);


  async function handleBadge(data: FormData) {
    const visibility = data.get("visibility") as string;
    const isProtected = data.get("protected") !== null;

    const res = await setBadgeAction(visibility, isProtected, libInfo.id);
    resetLibInfo();
    setBadgeModalStatus(false);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  }






  return (
    <>
      {badgeModalStatus && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm'>
          <div className='relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-900/20'>

            <div className='flex shrink-0 items-center justify-between border-b border-slate-800 p-6'>
              <h3 className='flex items-center gap-2 text-xl font-bold text-white'>
                <Settings className='text-cyan-400' />
                Select Badge Type
              </h3>
              <button onClick={() => {
                setBadgeModalStatus(false);
                resetLibInfo();
              }}
                className='text-slate-400 transition-colors hover:text-white'>
                <X />
              </button>
            </div>

            <form action={handleBadge}>
              <div className='p-6 flex'>
                <div className='flex-1 flex flex-col justify-center items-center gap-4'>

                  <label><input type="radio" name="visibility" value="public" defaultChecked={libInfo.status === 'public'} /> Public</label>
                  <label><input type="radio" name="visibility" value="private" defaultChecked={libInfo.status === 'private'} /> Private</label>
                  <label><input type="radio" name="visibility" value="pending" defaultChecked={libInfo.status === 'pending'} /> Pending</label>
                </div>
                <div className='flex-1 flex flex-col justify-center items-center gap-4'>
                  <label><input type="checkbox" name="protected" defaultChecked={libInfo.isProtected} /> Protected</label>
                </div>
              </div>


              <div className="pb-6">

                <div className='flex flex-col items-center justify-center gap-5 border-t border-slate-800 pt-5 sm:flex-row'>

                  <button
                    type='button'
                    onClick={() => {
                      setBadgeModalStatus(false);
                      resetLibInfo();
                    }}
                    className='rounded-lg px-5 py-2.5 font-medium text-slate-300 transition-colors hover:bg-slate-800'>
                    Cancel
                  </button>

                  <button
                    type='submit'
                    className='flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-cyan-500/40 transition-all hover:bg-cyan-500 disabled:opacity-75'>
                    Ok
                  </button>

                </div>

              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}