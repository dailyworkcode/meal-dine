'use server';

import { generateContent } from '@/ai/gemini';
import {
    type RecipeWithoutImage,
    GenerateRecipeOutputSchema,
} from '@/ai/schemas';

export async function refineRecipe(
    currentRecipe: RecipeWithoutImage,
    feedback: string,
    language: string
): Promise<RecipeWithoutImage> {
    const prompt = `You are an expert master chef. Refine the following recipe based on user feedback:
    
    Current Recipe:
    - Name: ${currentRecipe.dishName.en}
    - Ingredients: ${currentRecipe.ingredients.map(i => i.name.en).join(', ')}
    
    User Feedback: "${feedback}"
    
    Modify the recipe to incorporate the feedback while maintaining the authentic regional feel and nutritional balance.
    
    Return a JSON object following the Recipe schema (WITHOUT the dishImageUrl):
    - dishName: { en, hi }
    - description: { en, hi }
    - prepTime: { en, hi }
    - cookTime: { en, hi }
    - servings: { en, hi }
    - ingredients: array of { name: { en, hi } }
    - instructions: array of { en, hi }
    
    Ensure the output is valid JSON and strictly follows the schema.`;

    const refinedRecipe = await generateContent<RecipeWithoutImage>(prompt);
    return refinedRecipe;
}
