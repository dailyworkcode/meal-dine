'use server';

/**
 * @fileOverview Generates a personalized yoga session based on user profile.
 */

import { generateContent } from '@/ai/gemini';
import { generateImage } from '@/ai/imageGen';
import { getYogaPoseImage } from '@/ai/yogaLib';
import {
    GenerateYogaSessionInputSchema,
    GenerateYogaSessionOutputSchema,
    type GenerateYogaSessionInput,
    type GenerateYogaSessionOutput,
} from '@/ai/schemas';

export async function generateYogaSession(
    input: GenerateYogaSessionInput
): Promise<GenerateYogaSessionOutput> {
    const prompt = `
  Generate a personalized 15-30 minute yoga session for the following user:
  - Name: ${input.name}
  - Age: ${input.age}
  - Health Goals: ${input.healthGoals || 'General Wellness'}
  - Activity Level: ${input.activityLevel || 'Beginner'}

  The session should be tailored to their goals and ability level.
  
  IMPORTANT: 
  1. Use standardized yoga pose names in English (e.g., "Mountain Pose", "Downward-Facing Dog", "Cobra Pose").
  2. Provide BOTH English and Hindi versions for all text fields in the structure: { "en": "...", "hi": "..." }.
  
  Return a JSON object with:
  - title: Creative name for the session
  - description: Goal of the session
  - duration: Total time
  - poses: Array of 5-8 poses, each with name, duration, benefits, and instructions.
  
  DO NOT include imageUrl in the response - it will be added separately.
  `;

    const result = await generateContent<GenerateYogaSessionOutput>(prompt);

    // Map images for each pose based on the standardized English name
    const posesWithImages = await Promise.all(result.poses.map(async (pose) => {
        // 1. First check if we have a curated high-quality image in our controlled library
        const curatedUrl = getYogaPoseImage(pose.name.en);

        // If the URL returned is NOT the generic default, or if we want to force curated for standard poses
        // (This guarantees and avoids AI limb distortion for standard yoga poses)
        const isDefault = curatedUrl.includes('photo-1544367567-0f2fcb009e0b');

        if (!isDefault) {
            return { ...pose, imageUrl: curatedUrl };
        }

        // 2. If it's a "Creative" or non-standard pose, attempt AI generation
        const imagePrompt = `yoga-pose: ${pose.name.en}. Posture: ${pose.instructions.en}. 
        Style: Professional fitness photography, clean minimalist background, soft cinematic lighting, 8k resolution, serene atmosphere.`;

        const imageUrl = await generateImage(imagePrompt, {
            negativePrompt: "extra limbs, missing limbs, distorted body, overlapping limbs, mutated hands, furniture, trees, text, watermark, blurry",
            fallbackUrl: curatedUrl // Use our best library guess as final fallback
        });

        return {
            ...pose,
            imageUrl,
        };
    }));

    return {
        ...result,
        poses: posesWithImages,
    };
}
