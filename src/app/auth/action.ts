"use server";

import { ActionResponse, SigninSchema, SignupSchema } from '@/components/myTypes';
import { createUser, findUserByEmail } from '@/components/neon';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"






export async function signInAction(prev: (ActionResponse | null), formData: FormData) {
  try {
    const payload = Object.fromEntries(formData);
    const { data, success, error } = SigninSchema.safeParse(payload);

    if (!success) {
      const issue = error.issues.map(i => ({ [i.path.toString()]: i.message }))
      return { success: false, message: JSON.stringify(issue) };
    }

    const user = await findUserByEmail(data.email);
    if (!user) return { success: false, message: 'Invalid email or password' };

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) return { success: false, message: 'Invalid email or password' };


    const accessToken = jwt.sign({ id: Number(user.id) }, process.env.ACCESS_JWT_SECRET!, { expiresIn: Number(process.env.ACCESS_TOKEN_TTL) })
    const refreshToken = jwt.sign({ id: Number(user.id) }, process.env.REFRESH_JWT_SECRET!, { expiresIn: Number(process.env.REFRESH_TOKEN_TTL) })


    const cookie = await cookies();
    cookie.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(process.env.ACCESS_TOKEN_TTL),
    });

    cookie.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(process.env.REFRESH_TOKEN_TTL),
    });

    revalidatePath('/');

    return { success: true, message: `Welcome back ${user.name}!` };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}


export async function signUpAction(prev: (ActionResponse | null), formData: FormData) {
  try {
    const payload = Object.fromEntries(formData);
    const { data, success, error } = SignupSchema.safeParse(payload);

    if (!success) {
      const issue = error.issues.map(i => ({ [i.path.toString()]: i.message }))
      return { success: false, message: JSON.stringify(issue) };
    }

    const { name, email, password } = data;

    const res = await findUserByEmail(email);
    if (res) return { success: false, message: 'This email address already exists.' };

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await createUser(name, email, hashedPassword);


    const accessToken = jwt.sign({ id: Number(user.id) }, process.env.ACCESS_JWT_SECRET!, { expiresIn: Number(process.env.ACCESS_TOKEN_TTL) })
    const refreshToken = jwt.sign({ id: Number(user.id) }, process.env.REFRESH_JWT_SECRET!, { expiresIn: Number(process.env.REFRESH_TOKEN_TTL) })


    const cookie = await cookies();
    cookie.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(process.env.ACCESS_TOKEN_TTL),
    });

    cookie.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Number(process.env.REFRESH_TOKEN_TTL),
    });

    revalidatePath('/');

    return { success: true, message: "Your account has been successfully created" };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}


export async function signOutAction() {
  const cookie = await cookies();
  cookie.delete('accessToken')
  cookie.delete('refreshToken')
  revalidatePath('/');
}