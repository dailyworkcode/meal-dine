'use server';

import { generateContent } from '@/ai/gemini';
import {
    type GenerateZenReflectionInput,
    type ZenReflection,
    ZenReflectionSchema,
} from '@/ai/schemas';

export async function generateZenReflection(
    input: GenerateZenReflectionInput
): Promise<ZenReflection> {
    const prompt = `You are a compassionate Zen master and somatic therapist. 
  The user has shared their current mood and a brief reflection:
  - Mood: ${input.mood}
  - Reflection: ${input.reflection}
  
  Provide a mindful and empathetic response that helps the user feel seen and grounded.
  
  Return a JSON object following the ZenReflection schema:
  - reflection: { en, hi } (An empathetic acknowledgement of their feeling)
  - somaticTip: { en, hi } (A short physical grounding exercise like "Notice the contact of your feet on the floor" or "Softly relax your jaw")
  - affirmation: { en, hi } (A supportive affirmation that resonates with their current state)
  
  Ensure the tone is warm, non-judgmental, and premium. Use culturally resonant language for the Hindi version.`;

    const reflection = await generateContent<ZenReflection>(prompt);
    return reflection;
}
