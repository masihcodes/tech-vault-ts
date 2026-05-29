'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader, LogIn, X } from 'lucide-react';
import { toast } from 'sonner';
import { signInAction } from '@/app/auth/action';
import { setAuthCredentials } from '@/components/authStorage';
import { loginAction, setSignInModalStatus, setSignUpModalStatus, useLibStore } from './useLibStore';

interface ActionResponse {
  success: boolean;
  message: string;
  user?: { name: string; email: string; };
}

export default function SignInModal() {

  const signInModalStatus = useLibStore(s => s.signInModalStatus);

  const router = useRouter();
  const pendingCredentials = useRef<{ email: string; password: string; } | null>(null);
  const [state, formAction, pending] = useActionState<ActionResponse | null, FormData>(signInAction, null,);

  function handleSubmit(formData: FormData) {
    pendingCredentials.current = { email: formData.get('email') as string, password: formData.get('password') as string, };
    formAction(formData);
  }

  useEffect(() => {
    if (!state) return;

    if (state.success && state.user && pendingCredentials.current) {
      setAuthCredentials({
        name: state.user.name,
        email: pendingCredentials.current.email,
        password: pendingCredentials.current.password,
      });
      toast.success(state.message);
      loginAction(state.user.name);
      setSignInModalStatus(false);

    } else if (!state.success) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <>
      {signInModalStatus && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm'>
          <div className='relative z-10 flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-cyan-900/20'>
            <div className="p-6">
              <button
                className='text-slate-400 transition-colors hover:text-white absolute top-4 right-4 '
                onClick={() => {
                  setSignInModalStatus(false);
                }}>
                <X />
              </button>
              <div className="mb-8 text-center">
                <LogIn className="mx-auto mb-3 h-10 w-10 text-cyan-400" />
                <h2 className="text-3xl font-extrabold text-white">Sign In</h2>
                <p className="mt-2 text-slate-400">Welcome back to DevStack Vault</p>
              </div>
              <form action={handleSubmit} className="space-y-5">
                <label className="block text-sm font-medium text-slate-400">
                  Email
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
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
                  {pending ? <Loader className="animate-spin" /> : <LogIn className="h-4 w-4" />}
                  Sign In
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-slate-400">
                Don&apos;t have an account?{' '}
                <span
                  onClick={() => {
                    setSignUpModalStatus(true);
                    setSignInModalStatus(false);
                  }}
                  className="font-medium text-cyan-400 hover:text-cyan-300 cursor-pointer">
                  Sign up
                </span>
              </p>
            </div>
          </div>
        </div >
      )
      }
    </>
  );
}
