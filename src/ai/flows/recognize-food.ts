'use server';

import { generateVisionContent } from '@/ai/gemini';
import { FoodRecognitionOutput } from '@/ai/schemas';

export async function recognizeFood(
    base64Image: string,
    mimeType: string,
    language: string = 'en'
): Promise<FoodRecognitionOutput> {
    const prompt = `You are an elite clinical nutritionist and food AI. 
  Analyze the provided image of a meal and provide a detailed nutritional breakdown.
  
  If the image is not a food item, return a placeholder with an error message in 'healthInsights'.
  
  Provide the following in the JSON response:
  - dishName: { en, hi }
  - calories: Estimated total calories (number)
  - macros: { protein, carbs, fats } (numbers in grams)
  - nutritionScore: A score from 1-10 based on nutritional density and balance.
  - healthInsights: { en, hi } (Brief feedback on why this is healthy or how to balance it better)
  - ingredients: Array of { en, hi } (Detected main ingredients)
  
  Format the output as valid JSON.`;

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };

    try {
        const result = await generateVisionContent<FoodRecognitionOutput>(prompt, imagePart);
        return result;
    } catch (error) {
        console.error('Food recognition failed:', error);
        throw new Error('Failed to analyze the image. Please try again.');
    }
}
