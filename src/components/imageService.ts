import { v2 as cloudinary } from 'cloudinary';
import { InferenceClient } from '@huggingface/inference';



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const IMAGE_MODELS = [
  'black-forest-labs/FLUX.1-schnell',
  'stabilityai/sdxl-turbo',
  'prompthero/openjourney',
  'runwayml/stable-diffusion-v1-5',
  'stabilityai/stable-diffusion-xl-base-1.0',

  // 'playgroundai/playground-v2.5-1024px-aesthetic',
  // 'krea/Krea-2-Turbo',
  // 'RunDiffusion/Juggernaut-XL-v9',
];

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

  for (const model of IMAGE_MODELS) {
    try {
      const icon = await hf.textToImage({
        model: model,
        inputs: prompt,
      });

      if (icon && (typeof icon === 'string' ? icon.length > 0 : (icon as unknown as Blob).size > 0)) {
        console.log(`mage generated successfully with ${model}! Uploading to Cloudinary...`);
        return await uploadToCloudinary(icon);
      }
    } catch (error) {
      console.warn(`Model [${model}] failed or busy. Switching to next backup model...`, error);
    }
  }

  try {
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=200&height=200&nologo=true`;

    const response = await fetch(pollinationsUrl);
    if (response.ok) {
      const icon = await response.blob();
      if (icon && icon.size > 0) {
        console.log('✅ Image generated via Pollinations.ai! Uploading to Cloudinary...');
        return await uploadToCloudinary(icon);
      }
    }
  } catch (fallbackError) {
    console.error('Pollinations fallback also failed:', fallbackError);
  }

  console.error('All AI Image generation models failed. Using default icon.');
  return FALLBACK_URL;
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
