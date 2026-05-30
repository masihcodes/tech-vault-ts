"use server";

import { revalidatePath } from 'next/cache';
import { getSessionUser, removeFromMyLib, updatePersonalNote } from '@/components/neon';
import { ActionResponse, LibraryItem } from '@/components/myTypes';





export async function removeFromMyLibAction(target: LibraryItem): Promise<ActionResponse> {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    await removeFromMyLib(target.id, user);

    revalidatePath("/mylib");
    return { success: true, message: `${target.name} has been removed` };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}


export async function personalNoteAction(data: LibraryItem): Promise<ActionResponse> {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    await updatePersonalNote(data.id, data.personalNote, user);

    revalidatePath("/mylib");
    return { success: true, message: `${data.name} note, has been updated` };

  } catch (error: unknown) {
    return (error instanceof Error) ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}