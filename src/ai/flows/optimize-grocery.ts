'use server';

import { generateContent } from '@/ai/gemini';
import { LocalizedString } from '@/ai/schemas';

export interface OptimizedGroceryItem {
    name: LocalizedString;
    category: LocalizedString;
    estimatedQuantity: LocalizedString;
    substitutes: LocalizedString[];
}

export interface OptimizedGroceryOutput {
    categories: {
        name: LocalizedString;
        items: OptimizedGroceryItem[];
    }[];
}

export async function optimizeGrocery(
    ingredients: { name: LocalizedString }[],
    language: string = 'en'
): Promise<OptimizedGroceryOutput> {
    const ingredientsList = ingredients.map(i => i.name.en).join(', ');

    const prompt = `You are an expert procurement specialist for Indian kitchens. 
    Analyze the following list of ingredients and organize them into a smart grocery list.
    
    Ingredients: ${ingredientsList}
    
    Tasks:
    1. Group items into categories (e.g., Vegetables, Protiens/Dairy, Grains/Flours, Spices/Pantry).
    2. Estimate reasonable quantities for a family of 4 for these items based on common usage in these dishes.
    3. Suggest common Indian-kitchen substitutes for at least 3 items if they might be hard to find.
    
    Return a JSON object with 'categories', where each category has a 'name' (LocalizedString) and 'items' (OptimizedGroceryItem array).
    Each item has 'name', 'category', 'estimatedQuantity', and 'substitutes' (all LocalizedString).
    
    Format the output as valid JSON.`;

    try {
        const result = await generateContent<OptimizedGroceryOutput>(prompt);
        return result;
    } catch (error) {
        console.error('Grocery optimization failed:', error);
        throw new Error('Failed to optimize grocery list.');
    }
}
