'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Loader, UserPlus, X } from 'lucide-react';

import { signUpAction } from '@/app/auth/action';
import { setSignInModalStatus, setSignUpModalStatus, useLibStore } from './useLibStore';
import { ActionResponse } from './myTypes';




export default function SignUpModal() {

  const signUpModalStatus = useLibStore(s => s.signUpModalStatus);


  const [state, formAction, pending] = useActionState<ActionResponse | null, FormData>(signUpAction, null,);


  useEffect(() => {

    if (state && state.success) {
      toast.success(state.message);
      setSignUpModalStatus(false);

    } else if (state && !state.success) {
      try {
        JSON.parse(state.message).forEach((i: Record<string, string>) => toast.error(`${Object.keys(i)}: ${Object.values(i)}`));
      } catch {
        toast.error(state.message)
      }
    }
  }, [state]);



  return (
    <div>
      {signUpModalStatus && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm'>
          <div className='relative z-10 flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-900/20'>
            <div className="p-6">
              <button
                className='text-slate-400 transition-colors hover:text-white absolute top-4 right-4 '
                onClick={() => {
                  setSignUpModalStatus(false);
                }}>
                <X />
              </button>
              <div className="mb-8 text-center">
                <UserPlus className="mx-auto mb-3 h-10 w-10 text-cyan-400" />
                <h2 className="text-3xl font-extrabold text-white">Sign Up</h2>
                <p className="mt-2 text-slate-400">Create your DevStack Vault account</p>
              </div>
              <form action={formAction} className="space-y-5">
                <label className="block text-sm font-medium text-slate-400">
                  Full Name
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white transition-colors focus:border-cyan-500 focus:outline-none"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-400">
                  Email
                  <input
                    type="text"
                    name="email"
                    required
                    placeholder="jane@example.com"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white transition-colors focus:border-cyan-500 focus:outline-none"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-400">
                  Password
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white transition-colors focus:border-cyan-500 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  disabled={pending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 py-3 font-medium text-white shadow-lg shadow-cyan-500/40 transition-all hover:bg-cyan-500 disabled:opacity-75">
                  {pending ? <Loader className="animate-spin" /> : <UserPlus className="h-4 w-4" />}
                  Create Account
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-400">
                Already have an account?{' '}
                <span
                  onClick={() => {
                    setSignUpModalStatus(false);
                    setSignInModalStatus(true);
                  }}
                  className="font-medium text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  Sign in
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
