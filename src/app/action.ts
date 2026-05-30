"use server";

import { revalidatePath } from 'next/cache';
import { createLib, getSessionUser, removeLib, toggleBookmark, updateLib } from '../components/neon';
import { ActionResponse, LibraryItem, LibraryItemScheme } from '@/components/myTypes';
import { z } from 'zod';




export async function createLibAction(prev: (ActionResponse | null), formData: FormData): Promise<ActionResponse> {
  try {

    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    const payload = Object.fromEntries(formData);
    const { data, success, error } = LibraryItemScheme.safeParse(payload);

    if (!success) return { success: false, message: z.prettifyError(error) };


    const res = await createLib({ ...data, isBookmarked: false, personalNote: null });
    revalidatePath("/");
    revalidatePath("/mylib");
    return { success: true, message: `${res.name} has been successfully created` };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}




export async function updateLibAction(target: LibraryItem, prev: (ActionResponse | null), formData: FormData): Promise<ActionResponse> {

  try {

    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    const payload = Object.fromEntries(formData);
    const { data, success, error } = LibraryItemScheme.safeParse(payload);

    if (!success) return { success: false, message: z.prettifyError(error) };


    const res = await updateLib({ id: target.id, isBookmarked: target.isBookmarked, personalNote: target.personalNote, ...data });
    revalidatePath("/");
    revalidatePath("/mylib");
    return { success: true, message: `${res.name} has been successfully updated` };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}


export async function removeLibAction(id: string | number) {
  try {

    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    const res = await removeLib(id);
    revalidatePath("/");
    revalidatePath("/mylib");
    return { success: true, message: `${res.name} has been removed` };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}


export async function isBookmarkedAction(id: string | number) {
  try {

    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    await toggleBookmark(id, user);

    revalidatePath("/");
    revalidatePath("/mylib");
    return { success: true, message: "Your bookmark has been successfully updated" };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}