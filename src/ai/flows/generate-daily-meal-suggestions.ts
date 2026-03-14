'use server';

/**
 * @fileOverview Generates daily meal suggestions (breakfast, lunch, and dinner) with recipes based on user dietary preferences and available ingredients.
 *
 * - generateDailyMealSuggestions - A function that generates daily meal suggestions with recipes.
 */

import { generateContent } from '@/ai/gemini';
import { generateImage } from '@/ai/imageGen';
import {
  type GenerateDailyMealSuggestionsInput,
  type GenerateDailyMealSuggestionsOutput,
  type GenerateDailyMealSuggestionsOutputWithoutImages,
  type RecipeWithoutImage,
} from '@/ai/schemas';
import type { MealType } from '@/lib/types';

export async function generateDailyMealSuggestions(
  input: GenerateDailyMealSuggestionsInput
): Promise<GenerateDailyMealSuggestionsOutput> {
  const prompt = `You are an expert master chef and clinical nutritionist specializing in authentic regional Indian cuisines, with deep knowledge of the specific flavors and ingredients of ${input.region}, ${input.country}.
  
  Generate a complete, highly personalized daily meal plan for a user with the following profile:
  - Name: ${input.name}
  - Age: ${input.age}
  - Diet Type: ${input.dietType}
  - Strategic Location: ${input.region}, ${input.country} (Prioritize ingredients and dishes native to this specific region)
  - Dietary Preferences: ${input.dietaryPreferences}
  - Health Goals: ${input.healthGoals || 'None'}
  - Activity Level: ${input.activityLevel || 'Normal'}
  - Allergies: ${input.allergies || 'None'}
  - Available Ingredients: ${input.availableIngredients}
  - Recent Meal History (DO NOT repeat these): ${input.mealHistory || 'None'}

  CRITICAL GUIDELINES:
  1. REGIONALITY: Since the user is in ${input.region}, include at least two authentic, traditional dishes from that specific state (e.g., Jharkhandi specialties like Dhuska, Chilka Roti, or Arbi/Madua recipes if appropriate).
  2. NUTRITIONAL BALANCE: Ensure the total day aligns with the "Normal" diet type but is elevated for energy and health.

  Return a JSON object with:
  - breakfast (object)
  - lunch (object)
  - snacks (object)
  - dinner (object)

  Each meal object must follow the Recipe schema:
  - dishName: { en, hi }
  - description: { en, hi }
  - prepTime: { en, hi }
  - cookTime: { en, hi }
  - servings: { en, hi }
  - ingredients: array of { name: { en, hi } }
  - instructions: array of { en, hi }`;

  const mealPlanWithoutImages =
    await generateContent<GenerateDailyMealSuggestionsOutputWithoutImages>(
      prompt
    );

  const mealTypes: MealType[] = ["breakfast", "lunch", "snacks", "dinner"];

  const FALLBACK_MEAL: RecipeWithoutImage = {
    dishName: { en: 'Not Available', hi: 'उपलब्ध नहीं है' },
    description: { en: 'Meal suggestion not available at this time.', hi: 'भोजन का सुझाव इस समय उपलब्ध नहीं है।' },
    prepTime: { en: '0 mins', hi: '0 मिनट' },
    cookTime: { en: '0 mins', hi: '0 मिनट' },
    servings: { en: '1', hi: '1' },
    ingredients: [],
    instructions: [],
  };

  const imagePromises = mealTypes.map(async (mealType, index) => {
    const dish = mealPlanWithoutImages[mealType] || FALLBACK_MEAL;

    if (dish.dishName.en === 'Not Available') {
      return { mealType, imageUrl: '' };
    }

    // Stagger the requests by 1.5 seconds each to avoid overloading Stability AI/Network
    if (index > 0) {
      await new Promise(resolve => setTimeout(resolve, index * 1500));
    }

    const ingredientsList = dish.ingredients.map(i => i.name.en).join(', ');
    const imagePrompt = `
Ultra-realistic professional food photography of authentic Indian cuisine: ${dish.dishName.en}.
Description: ${dish.description.en}.
A beautifully plated dish featuring ${ingredientsList}.
Traditional tableware, cinematic lighting, 8k resolution, 
highly detailed textures, sharp focus, appetizing presentation.
No text, no labels, no watermarks.
`;

    try {
      const imageUrl = await generateImage(imagePrompt);
      return { mealType, imageUrl };
    } catch (error) {
      console.error(`Failed to generate image for ${mealType}:`, error);
      // Generate a dynamic fallback if the main generation somehow fails completely
      const fallbackUrl = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1024&h=1024`;
      return { mealType, imageUrl: fallbackUrl };
    }
  });

  const resolvedImages = await Promise.all(imagePromises);
  const imageResults: Record<string, string> = {};
  resolvedImages.forEach(res => {
    imageResults[res.mealType] = res.imageUrl;
  });

  return {
    breakfast: {
      ...mealPlanWithoutImages.breakfast,
      dishImageUrl: imageResults["breakfast"],
    },
    lunch: {
      ...mealPlanWithoutImages.lunch,
      dishImageUrl: imageResults["lunch"],
    },
    snacks: {
      ...mealPlanWithoutImages.snacks,
      dishImageUrl: imageResults["snacks"],
    },
    dinner: {
      ...mealPlanWithoutImages.dinner,
      dishImageUrl: imageResults["dinner"],
    },
  };
}
