"use server";

import { revalidatePath } from 'next/cache';
import { createLib, getSessionUser, removeLib, toggleBookmark, updateLib } from '../components/neon';
import { ActionResponse, LibraryItem } from '@/components/myTypes';




export async function createLibAction(prev: (ActionResponse | null), formData: FormData): Promise<ActionResponse> {
  try {

    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      installCommand: formData.get('installCommand') as string,
      docsUrl: formData.get('docsUrl') as string
    };

    if (!payload.name || !payload.category || !payload.description || !payload.installCommand || !payload.docsUrl) {
      return { success: false, message: "All fields are required" };
    }

    const res = await createLib({ ...payload, isBookmarked: false, personalNote: null });
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

    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      installCommand: formData.get('installCommand') as string,
      docsUrl: formData.get('docsUrl') as string
    };

    if (!payload.name || !payload.category || !payload.description || !payload.installCommand || !payload.docsUrl) {
      return { success: false, message: "All fields are required" };
    }

    const res = await updateLib({
      id: target.id,
      isBookmarked: target.isBookmarked,
      personalNote: target.personalNote,
      ...payload
    });
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