'use server';

import { generateContent } from '@/ai/gemini';
import {
    type GenerateWellnessRitualInput,
    type WellnessRitualAI,
    WellnessRitualSchema,
} from '@/ai/schemas';

export async function generateWellnessRitual(
    input: GenerateWellnessRitualInput
): Promise<WellnessRitualAI> {
    const prompt = `You are an elite wellness coach and PulseAI assistent. 
  Generate a "Total Wellness Ritual" for today for a user with the following profile:
  - Name: ${input.name}
  - Age: ${input.age}
  - Diet Type: ${input.dietType}
  - Location: ${input.location}
  - Health Goals: ${input.healthGoals || 'General Wellbeing'}
  - Activity Level: ${input.activityLevel || 'Normal'}
  
  The ritual should be a cohesive daily focus that combines nutrition, movement, and mindfulness.
  
  Return a JSON object following the WellnessRitual schema:
  - dayFocus: { en, hi } (e.g., "Calm Energy & Grounding")
  - mealHighlight: { en, hi } (e.g., "Focus on a protein-rich breakfast to stabilize blood sugar")
  - yogaFocus: { en, hi } (e.g., "Child's Pose and gentle twists for digestive health")
  - mindfulTip: { en, hi } (e.g., "Take 3 deep breaths before your first bite")
  - benefit: { en, hi } (e.g., "Reduced stress and sustained energy throughout the day")
  
  Ensure the tone is supportive, premium, and culturally resonant with their location if possible.`;

    const ritual = await generateContent<WellnessRitualAI>(prompt);
    return ritual;
}
