'use server';

/**
 * @fileOverview Generates a detailed recipe for a given dish.
 *
 * - generateRecipe - A function that generates a recipe.
 */

import { generateContent } from '@/ai/gemini';
import { generateImage } from '@/ai/imageGen';
import {
  type GenerateRecipeInput,
  type GenerateRecipeOutput,
  type RecipeWithoutImage,
} from '@/ai/schemas';

export async function generateRecipe(
  input: GenerateRecipeInput
): Promise<GenerateRecipeOutput> {
  const prompt = `You are a master chef specializing in Indian cuisine. Generate a detailed recipe for: ${input.dishName}.
 
  IMPORTANT: Provide BOTH English and Hindi versions for all fields (dishName, description, prepTime, cookTime, servings, ingredients, instructions) in the structure: { "en": "...", "hi": "..." }.

  CRITICAL: The Hindi "dishName" must be a direct translation of the specific dish name. DO NOT use generic category names.

  Return a JSON object following the Recipe schema. Include ingredients and instructions.`;

  const recipeWithoutImage = await generateContent<RecipeWithoutImage>(prompt);

  // Step 2: Generate the image for the dish using the AI model.
  const ingredientsList = recipeWithoutImage.ingredients.map(i => i.name.en).join(', ');
  const imagePrompt = `Ultra-realistic professional food photography of ${recipeWithoutImage.dishName.en}. 
  Description: ${recipeWithoutImage.description.en}. 
  Key ingredients shown: ${ingredientsList}.
  Style: Authentic Indian cuisine, traditionally served, vibrant colors, beautifully plated on rustic tableware, cinematic lighting, 8k resolution, highly detailed, sharp focus, appetizing.`;
  let imageUrl = '';
  try {
    imageUrl = await generateImage(imagePrompt);
  } catch (error) {
    console.error(`Failed to generate recipe image for ${input.dishName}:`, error);
  }

  return {
    ...recipeWithoutImage,
    dishImageUrl: imageUrl,
  };
}
