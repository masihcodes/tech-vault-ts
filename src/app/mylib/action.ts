"use server";

import { revalidatePath } from 'next/cache';
import { updateLib } from '@/components/neon';
import { LibraryItem } from '@/components/useLibStore';



interface ActionResponse {
  success: boolean;
  message: string;
}


export async function removeMyLibAction(target: LibraryItem): Promise<ActionResponse> {
  try {
    const res = await updateLib({ ...target, isBookmarked: false, personalNote: null });
    revalidatePath("/mylib");
    return { success: true, message: `${res.name} has been removed` };
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message };
    return { success: false, message: "An unknown error occurred" };
  }
}


export async function personalNoteAction(data: LibraryItem): Promise<ActionResponse> {
  try {
    const res = await updateLib(data);
    revalidatePath("/mylib");
    return { success: true, message: `${res.name} note, has been updated` };
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message };
    return { success: false, message: "An unknown error occurred" };
  }
}