'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { signUpAction } from '@/app/auth/action';
import { setAuthCredentials } from '@/components/authStorage';

interface ActionResponse {
  success: boolean;
  message: string;
  user?: { name: string; email: string };
}

export default function SignUpForm() {
  const router = useRouter();
  const pendingCredentials = useRef<{ name: string; email: string; password: string } | null>(null);
  const [state, formAction, pending] = useActionState<ActionResponse | null, FormData>(
    signUpAction,
    null,
  );

  function handleSubmit(formData: FormData) {
    pendingCredentials.current = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
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
      router.push('/');
      router.refresh();
    } else if (!state.success) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-700 bg-slate-900/50 p-8 shadow-xl shadow-cyan-900/10">
      <div className="mb-8 text-center">
        <UserPlus className="mx-auto mb-3 h-10 w-10 text-cyan-400" />
        <h2 className="text-3xl font-extrabold text-white">Sign Up</h2>
        <p className="mt-2 text-slate-400">Create your DevStack Vault account</p>
      </div>

      <form action={handleSubmit} className="space-y-5">
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
            type="email"
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
        <Link href="/sign-in" className="font-medium text-cyan-400 hover:text-cyan-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
