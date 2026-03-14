import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

export const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash',
    generationConfig: {
        responseMimeType: 'application/json',
    },
});

export const chatModel = genAI.getGenerativeModel({
    model: process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash',
});


/**
 * Helper to generate structured content using direct SDK with retry logic.
 */
export async function generateContent<T>(
    prompt: string,
    retries: number = 3,
    delay: number = 2000
): Promise<T> {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text) as T;
    } catch (error: any) {
        return handleGeminiError(error, () => generateContent<T>(prompt, retries - 1, delay * 2), retries, delay);
    }
}

/**
 * Helper to generate content from images and text.
 */
export async function generateVisionContent<T>(
    prompt: string,
    imagePart: { inlineData: { data: string; mimeType: string } },
    retries: number = 3,
    delay: number = 2000
): Promise<T> {
    try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        return JSON.parse(text) as T;
    } catch (error: any) {
        return handleGeminiError(error, () => generateVisionContent<T>(prompt, imagePart, retries - 1, delay * 2), retries, delay);
    }
}

function handleGeminiError(error: any, retryFn: () => any, retries: number, delay: number) {
    const isRetryableError =
        error?.status === 429 ||
        error?.status === 503 ||
        error?.message?.includes('429') ||
        error?.message?.includes('503') ||
        error?.message?.includes('quota') ||
        error?.message?.includes('high demand');

    if (isRetryableError && retries > 0) {
        console.warn(`Gemini error (${error?.status || 'transient'}). Retrying in ${delay / 1000}s... (${retries} retries left)`);
        return new Promise((resolve) => setTimeout(resolve, delay)).then(retryFn);
    }

    if (error?.status === 429 || error?.message?.includes('quota')) {
        console.error('Gemini Quota Exhausted: You have reached the daily limit for the Gemini free tier.');
        throw new Error('Gemini quota exhausted. Please try again later.');
    }

    console.error('Gemini Generation Error:', error);
    throw error;
}
