'use server';

/**
 * @fileOverview Refines meal suggestions based on user feedback.
 *
 * - refineMealSuggestions - A function that takes meal suggestions and user feedback to refine the suggestions.
 */

import { generateContent } from '@/ai/gemini';
import {
  type RefineMealSuggestionsInput,
  type RefineMealSuggestionsOutput,
} from '@/ai/schemas';

export async function refineMealSuggestions(
  input: RefineMealSuggestionsInput
): Promise<RefineMealSuggestionsOutput> {
  const prompt = `You are a personal meal suggestion assistant. You will refine the given meal suggestions based on the user feedback.

Current Meal Suggestions: ${input.mealSuggestions}
User Feedback: ${input.feedback}

Refine the suggestions while keeping the vibe and health goals.
Return a JSON object with:
- refinedSuggestions (the complete refined text)`;

  return await generateContent<RefineMealSuggestionsOutput>(prompt);
}
