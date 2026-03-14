'use server';

/**
 * @fileOverview This file contains the Genkit flow for suggesting an alternative dish with its full recipe.
 *
 * The flow takes a meal type, user's dietary preferences, and the current dish as input.
 * It returns a complete recipe for a single alternative dish.
 *
 * @exports {suggestAlternativeDishes} - The main function to trigger the flow.
 */

import { generateContent } from '@/ai/gemini';
import { generateImage } from '@/ai/imageGen';
import {
  type SuggestAlternativeDishesInput,
  type SuggestAlternativeDishesOutput,
  type RecipeWithoutImage,
} from '@/ai/schemas';

export async function suggestAlternativeDishes(
  input: SuggestAlternativeDishesInput
): Promise<SuggestAlternativeDishesOutput> {
  const prompt = `You are a personal chef. The user currently has "${input.currentSuggestion}" for ${input.mealType}.
  Suggest a different Indian dish for ${input.mealType} based on these preferences: ${input.dietaryPreferences}.
  
  IMPORTANT: Provide BOTH English and Hindi versions for all fields (dishName, description, prepTime, cookTime, servings, ingredients, instructions) in the structure: { "en": "...", "hi": "..." }.

  CRITICAL: The Hindi "dishName" MUST be a specific translation/transliteration of the dish. DO NOT use generic labels like "दोपहर का भोजन" (Lunch). Each dish must have a unique, descriptive Hindi name that matches the English meaning.

  Return a JSON object that matches the Recipe schema.
  Include ingredients and instructions.`;

  const recipeWithoutImage = await generateContent<RecipeWithoutImage>(prompt);

  // Step 2: Generate an AI image for the new dish using the AI model.
  const ingredientsList = recipeWithoutImage.ingredients.map(i => i.name.en).join(', ');
  const imagePrompt = `Ultra-realistic professional food photography of ${recipeWithoutImage.dishName.en}. 
  Description: ${recipeWithoutImage.description.en}. 
  Key ingredients shown: ${ingredientsList}.
  Style: Authentic Indian cuisine, traditionally served, vibrant colors, beautifully plated, cinematic lighting, 8k resolution, highly detailed, sharp focus, appetizing.`;
  let imageUrl = '';
  try {
    imageUrl = await generateImage(imagePrompt);
  } catch (error) {
    console.error(`Failed to generate alternative dish image for ${recipeWithoutImage.dishName}:`, error);
  }

  return {
    ...recipeWithoutImage,
    dishImageUrl: imageUrl,
  };
}
