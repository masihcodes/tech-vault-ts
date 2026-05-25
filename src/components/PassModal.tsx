"use client";

import { UserRoundKey, X, KeyRound } from 'lucide-react';
import { setMyPass, setPassModalStatus, setPendingAction, useLibStore } from './useLibStore';
import { passwordVerification } from '@/app/action';
import { toast } from 'sonner';
import { useState } from 'react';


export default function PassModal() {

  const passModalStatus = useLibStore(s => s.passModalStatus);
  const pendingAction = useLibStore(s => s.pendingAction);

  const [passInput, setPassInput] = useState("");


  async function handleVerify() {
    const res = await passwordVerification(passInput);
    if (res.success) {
      setMyPass(passInput);
      setPassModalStatus(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
        setPassInput("");
        setMyPass("");
      }
    } else {
      toast.error(res.message);
    }
  };



  return (
    <>
      {passModalStatus && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm'>
          <div className='relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-900/20'>

            <div className='flex shrink-0 items-center justify-between border-b border-slate-800 p-6'>
              <h3 className='flex items-center gap-2 text-xl font-bold text-white'>
                <UserRoundKey className='text-cyan-400' />
                Enter The Password
              </h3>
              <button
                className='text-slate-400 transition-colors hover:text-white'
                onClick={() => {
                  setPassModalStatus(false);
                  // setMyPass("");
                  setPassInput("");
                }}>
                <X />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto p-6">

              <label className='mb-1 block text-sm font-medium text-slate-400'>
                Password
                <div className='relative mt-1'>
                  <KeyRound className='absolute left-3 top-3 text-slate-500' />
                  <input
                    value={passInput}
                    onChange={e => setPassInput(e.target.value)}
                    name='password'
                    type='password'
                    placeholder='Enter the PASSWORD ...'
                    className='w-full rounded-lg border border-slate-700 bg-slate-950 py-3 pl-11 pr-3 text-sm text-white transition-colors focus:border-cyan-500 focus:outline-none'
                  />
                </div>
              </label>

              <div className='mt-10 flex flex-col items-center justify-center gap-5 border-t border-slate-800 pt-5 sm:flex-row'>

                <button
                  type='button'
                  onClick={() => {
                    setPassModalStatus(false);
                    // setMyPass("");
                    setPassInput("");
                  }}
                  className='rounded-lg px-5 py-2.5 font-medium text-slate-300 transition-colors hover:bg-slate-800'>
                  Cancel
                </button>

                <button
                  onClick={handleVerify}
                  type='button'
                  className='flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-cyan-500/40 transition-all hover:bg-cyan-500 disabled:opacity-75'>
                  Ok
                </button>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}