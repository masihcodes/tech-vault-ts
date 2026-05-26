'use server';

import { revalidatePath } from 'next/cache';
import { removeBookmark, updateBookmarkNote } from '@/components/neon';
import { AuthCredentials } from '@/components/authTypes';
import { LibraryItem } from '@/components/useLibStore';

interface ActionResponse {
  success: boolean;
  message: string;
}

export async function removeMyLibAction(
  target: LibraryItem,
  credentials: AuthCredentials,
): Promise<ActionResponse> {
  try {
    if (!credentials?.email || !credentials?.password) {
      return { success: false, message: 'Please sign in to manage your vault' };
    }

    await removeBookmark(target.id, credentials);
    revalidatePath('/');
    revalidatePath('/mylib');
    return { success: true, message: `${target.name} has been removed from your vault` };
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message };
    return { success: false, message: 'An unknown error occurred' };
  }
}

export async function personalNoteAction(
  data: LibraryItem,
  credentials: AuthCredentials,
): Promise<ActionResponse> {
  try {
    if (!credentials?.email || !credentials?.password) {
      return { success: false, message: 'Please sign in to save notes' };
    }

    await updateBookmarkNote(data.id, data.personalNote, credentials);
    revalidatePath('/mylib');
    return { success: true, message: `${data.name} note has been updated` };
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message };
    return { success: false, message: 'An unknown error occurred' };
  }
}
