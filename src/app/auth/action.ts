"use server";

import { ActionResponse } from '@/components/myTypes';
import { createUser, findUserByEmail, verifyUser } from '@/components/neon';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';






export async function signInAction(prev: (ActionResponse | null), formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) return { success: false, message: 'Email and password are required' };

    const user = await verifyUser({ email: email, password: password });

    if (!user) return { success: false, message: 'Invalid email or password' };

    const cookieStore = await cookies();
    cookieStore.set('auth-token', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath('/');

    return { success: true, message: `Welcome back ${user.name}!` };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}


export async function signUpAction(prev: (ActionResponse | null), formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) return { success: false, message: 'Email and password are required' };

    const res = await findUserByEmail(email);

    if (res) return { success: false, message: 'This email address already exists.' };

    const user = await createUser(name, email, password);

    const cookieStore = await cookies();
    cookieStore.set('auth-token', user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    revalidatePath('/');

    return { success: true, message: "Your account has been successfully created" };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}


export async function signOutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  revalidatePath('/');
}