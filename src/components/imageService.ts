import { v2 as cloudinary } from 'cloudinary';
import { InferenceClient } from '@huggingface/inference';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});


const hf = new InferenceClient(process.env.HUG_ACC_TOK);

async function uploadToCloudinary(input: string | File | Blob): Promise<string> {
  let imagePayload: string;

  if (typeof input === 'string') {
    imagePayload = input;
  }
  else {
    const arrayBuffer = await input.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    imagePayload = `data:${input.type || 'image/webp'};base64,${buffer.toString('base64')}`;
  }

  const result = await cloudinary.uploader.upload(imagePayload, {
    folder: 'tech-vault',
    transformation: [
      { width: 200, height: 200, crop: 'fill', gravity: 'center' },
      { fetch_format: 'webp', quality: 'auto' }
    ],
  });

  return result.secure_url;
}


export async function imageUrlFromUserFile(file: File): Promise<string> {
  const FALLBACK_URL = '/default-icon.png';
  try {
    return await uploadToCloudinary(file);
  } catch (error) {
    console.error('User image upload error:', error);
    return FALLBACK_URL;
  }
}

export async function imageUrlFromUserAI(name: string, description: string): Promise<string> {
  const FALLBACK_URL = '/default-icon.png';
  const prompt = `A minimalist flat vector icon for a developer tool named ${name}, ${description}, sleek dark sci-fi aesthetic, glowing cyan and slate colors, clean solid dark background, simple logo design, no text`;

  try {
    const blob = await hf.textToImage({
      model: 'stabilityai/stable-diffusion-xl-base-1.0',
      // model: 'black-forest-labs/FLUX.1-schnell',
      inputs: prompt,
      parameters: {
        negative_prompt: "blurry, text, watermark, low quality, realistic photo, 3d render",
        guidance_scale: 7.5,
      }
    });

    return await uploadToCloudinary(blob);
  } catch (error) {
    console.error('AI generation or upload error:', error);
    return FALLBACK_URL;
  }
}



export async function deleteFromCloudinary(imageUrl: string): Promise<boolean> {
  if (!imageUrl || imageUrl.startsWith('/') || imageUrl.includes('default-icon')) {
    return false;
  }
  try {
    const parts = imageUrl.split('/upload/');
    if (parts.length < 2)
      throw new Error('Invalid image URL');

    const publicId = parts[1].replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '');

    const result = await cloudinary.uploader.destroy(publicId);

    return result.result === 'ok';
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    return false;
  }
}




// export async function getOrGenerateImageUrl(file: File | undefined, name: string, description: string): Promise<string> {
//   const FALLBACK_URL = '/default-icon.png';

//   if (file && file.size > 0) {
//     try {
//       return await uploadToCloudinary(file);
//     } catch (error) {
//       console.error('User image upload error:', error);
//       return FALLBACK_URL;
//     }
//   }

//   try {
//     const prompt = `A minimalist flat vector icon for a developer tool named ${name}, ${description}, sleek dark sci-fi aesthetic, glowing cyan and slate colors, clean solid dark background, simple logo design, no text`;

//     const blob = await hf.textToImage({
//       model: 'stabilityai/stable-diffusion-xl-base-1.0',
//       // model: 'black-forest-labs/FLUX.1-schnell',
//       inputs: prompt,
//       parameters: {
//         negative_prompt: "blurry, text, watermark, low quality, realistic photo, 3d render",
//         guidance_scale: 7.5,
//       }
//     });

//     return await uploadToCloudinary(blob);
//   } catch (error) {
//     console.error('AI generation or upload error:', error);
//     return FALLBACK_URL;
//   }
// }