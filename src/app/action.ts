'use server';

import { revalidatePath } from 'next/cache';
import { createLib, removeLib, toggleBookmark, updateLib, verifyUser } from '../components/neon';
import { AuthCredentials } from '../components/authTypes';
import { LibraryItem } from '../components/useLibStore';

interface ActionResponse {
  success: boolean;
  message: string;
}

export async function createLibAction(
  credentials: AuthCredentials,
  prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    if (!credentials?.email || !credentials?.password) {
      return { success: false, message: 'Please sign in to add a library' };
    }

    const user = await verifyUser(credentials);
    if (!user) {
      return { success: false, message: 'Please sign in to add a library' };
    }

    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      installCommand: formData.get('installCommand') as string,
      docsUrl: formData.get('docsUrl') as string,
    };

    if (
      !payload.name ||
      !payload.category ||
      !payload.description ||
      !payload.installCommand ||
      !payload.docsUrl
    ) {
      return { success: false, message: 'All fields are required' };
    }

    const res = await createLib({ ...payload, isBookmarked: false, personalNote: null });
    revalidatePath('/');
    revalidatePath('/mylib');
    return { success: true, message: `${res.name} has been successfully created` };
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message };
    return { success: false, message: 'An unknown error occurred' };
  }
}

export async function updateLibAction(
  target: LibraryItem,
  prev: ActionResponse | null,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const payload = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      installCommand: formData.get('installCommand') as string,
      docsUrl: formData.get('docsUrl') as string,
    };

    if (
      !payload.name ||
      !payload.category ||
      !payload.description ||
      !payload.installCommand ||
      !payload.docsUrl
    ) {
      return { success: false, message: 'All fields are required' };
    }

    const res = await updateLib({
      id: target.id,
      isBookmarked: target.isBookmarked,
      personalNote: target.personalNote,
      ...payload,
    });
    revalidatePath('/');
    revalidatePath('/mylib');
    return { success: true, message: `${res.name} has been successfully updated` };
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message };
    return { success: false, message: 'An unknown error occurred' };
  }
}

export async function removeLibAction(id: string | number) {
  try {
    const res = await removeLib(id);
    revalidatePath('/');
    revalidatePath('/mylib');
    return { success: true, message: `${res.name} has been removed` };
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message };
    return { success: false, message: 'An unknown error occurred' };
  }
}

export async function isBookmarkedAction(data: LibraryItem, credentials: AuthCredentials) {
  try {
    if (!credentials?.email || !credentials?.password) {
      return { success: false, message: 'Please sign in to bookmark libraries' };
    }

    await toggleBookmark(data.id, credentials);
    revalidatePath('/');
    revalidatePath('/mylib');
    return { success: true, message: 'Your bookmark has been successfully updated' };
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message };
    return { success: false, message: 'An unknown error occurred' };
  }
}
