'use server';

import { revalidatePath } from 'next/cache';
import { createLib, getLibById, getSessionUser, removeLib, setBadge, toggleBookmark, updateLib } from '../components/neon';
import { ActionResponse, LibraryItem, LibraryItemScheme } from '@/components/myTypes';
import { z } from 'zod';

import { v2 as cloudinary } from 'cloudinary';
import { deleteFromCloudinary, imageUrlFromUserAI, imageUrlFromUserFile } from '@/components/imageService';
import { generateLibraryDetails, AgentResponse } from '@/components/agentService';



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});






export async function agentAssistAction(name: string): Promise<{ success: boolean; data?: AgentResponse; message?: string }> {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    if (!name || name.trim().length < 2) {
      return { success: false, message: 'Please type a valid library name first (at least 2 characters)' };
    }

    const details = await generateLibraryDetails(name.trim());
    if (!details) {
      return { success: false, message: 'AI Agent could not find details for this library. Please fill manually.' };
    }

    return { success: true, data: details };
  } catch (error: unknown) {
    return error instanceof Error ? { success: false, message: error.message } : { success: false, message: 'Agent failed' };
  }
}



export async function createLibAction(prev: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    const payload = Object.fromEntries(formData);
    const { data, success, error } = LibraryItemScheme.safeParse(payload);
    if (!success) return { success: false, message: z.prettifyError(error) };

    const { imageFile, ai, ...libData } = data

    let imageUrl = '/default-icon.png'
    if (ai && user.role === "admin") {
      imageUrl = await imageUrlFromUserAI(data.name, data.description)
    } else if (imageFile && imageFile.size > 0 && user.role === "admin") {
      imageUrl = await imageUrlFromUserFile(imageFile)
    }

    // const imageUrl = await getOrGenerateImageUrl(imageFile, data.name, data.description);

    const res = await createLib({
      ...libData,
      imageUrl: imageUrl,
      createdBy: user.id,
      isProtected: false,
      status: 'pending',
    });
    revalidatePath('/');
    revalidatePath('/mylib');
    return { success: true, message: `${res.name} has been successfully created` };
  } catch (error: unknown) {
    return error instanceof Error ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}




export async function updateLibAction(target: LibraryItem, prev: ActionResponse | null, formData: FormData,): Promise<ActionResponse> {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    const payload = Object.fromEntries(formData);
    const { data, success, error } = LibraryItemScheme.safeParse(payload);
    if (!success) return { success: false, message: z.prettifyError(error) };

    const realLib = await getLibById(target.id);
    if (!realLib) return { success: false, message: 'Library does not exist' };

    const { imageFile, ai, ...libData } = data

    let imageUrl = realLib.imageUrl;

    if (user.role === "admin") {
      if (ai) {
        await deleteFromCloudinary(realLib.imageUrl);
        imageUrl = await imageUrlFromUserAI(data.name, data.description);
      } else if (imageFile && imageFile.size > 0) {
        await deleteFromCloudinary(realLib.imageUrl);
        imageUrl = await imageUrlFromUserFile(imageFile);
      }
    }

    if (user.role === "admin") {
      const res = await updateLib({
        ...libData,
        imageUrl,
        id: realLib.id,
        createdBy: realLib.createdBy,
        isProtected: realLib.isProtected,
        status: realLib.status,
      });
      revalidatePath('/');
      revalidatePath('/mylib');
      return { success: true, message: `${res.name} has been successfully updated` };
    }

    if (user.role === "user" && !realLib.isProtected && realLib.createdBy !== user.id) {
      return { success: false, message: 'This library is not created by you and you can just update your own libraries' };
    }

    if (user.role === "user" && realLib.isProtected) {
      return { success: false, message: 'This library is protected and cannot be updated - please contact the admin' };
    } else {
      const res = await updateLib({
        ...libData,
        imageUrl: imageUrl,
        id: realLib.id,
        createdBy: realLib.createdBy,
        isProtected: realLib.isProtected,
        status: "pending",
      });
      revalidatePath('/');
      revalidatePath('/mylib');
      return { success: true, message: `${res.name} has been successfully updated` };
    }


  } catch (error: unknown) {
    return error instanceof Error ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}




export async function removeLibAction(id: string | number) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    const realLib = await getLibById(id);
    if (!realLib) return { success: false, message: 'Library does not exist' };

    if (user.role === "admin") {
      await deleteFromCloudinary(realLib.imageUrl);
      const res = await removeLib(id);
      revalidatePath('/');
      revalidatePath('/mylib');
      return { success: true, message: `${res.name} has been removed` };
    }

    if (user.role === "user" && !realLib.isProtected && realLib.createdBy !== user.id) {
      return { success: false, message: 'This library is not created by you and you can just remove your own libraries' };
    }

    if (user.role === "user" && realLib.isProtected) {
      return { success: false, message: 'This library is protected and cannot be removed - please contact the admin' };
    } else {
      await deleteFromCloudinary(realLib.imageUrl);
      const res = await removeLib(id);
      revalidatePath('/');
      revalidatePath('/mylib');
      return { success: true, message: `${res.name} has been removed` };
    }

  } catch (error: unknown) {
    return error instanceof Error ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}




export async function isBookmarkedAction(id: string | number) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    await toggleBookmark(id, user);

    revalidatePath('/');
    revalidatePath('/mylib');
    return { success: true, message: 'Your bookmark has been successfully updated' };
  } catch (error: unknown) {
    return error instanceof Error ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}


export async function setBadgeAction(visibility: string, isProtected: boolean, id: string | number) {
  try {
    const user = await getSessionUser();
    if (!user) return { success: false, message: 'Please sign in first' };

    if (user.role !== 'admin') return { success: false, message: 'Unauthorized! Only admins can perform this action.' };

    await setBadge(visibility, isProtected, id);

    revalidatePath('/');
    revalidatePath('/mylib');
    return { success: true, message: 'The badge has been successfully updated to ' + visibility + (isProtected ? ' (protected)' : '') };
  } catch (error: unknown) {
    return error instanceof Error ? { success: false, message: error.message } : { success: false, message: String(error) };
  }
}