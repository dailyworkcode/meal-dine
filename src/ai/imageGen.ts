import { genAI } from './gemini';

/**
 * Options for image generation
 */
export interface ImageGenOptions {
    negativePrompt?: string;
    fallbackUrl?: string;
    width?: number;
    height?: number;
    steps?: number;
    aspectRatio?: '1:1' | '4:3' | '3:4' | '16:9' | '9:16';
}

// Circuit breaker to prevent noisy logs if we know the API is restricted (e.g. Free Tier)
let isAiImageGenRestricted = false;

/**
 * Guaranteed Zen Visuals: A curated library of high-quality Indian food photography
 * used as a reliable fallback when AI generation is unavailable.
 */
const getDynamicFallback = (query: string) => {
    // Extract dish name - Keep it short and clean for URL stability
    let dishName = query.toLowerCase();

    // If it's a long AI prompt, extract the core dish name
    if (dishName.includes("cuisine:")) {
        dishName = dishName.split("cuisine:")[1];
    }

    // Remove common prompt prefixes/suffixes
    dishName = dishName.replace(/ultra-realistic|professional|photography|authentic|cuisine|indian|plated|dish|featuring|textures|sharp|focus|appetizing|presentation|no text|no labels/gi, '');
    dishName = dishName.split(".")[0].split(",")[0].split(":")[0].trim();

    // Base stable Unsplash Food IDs (Guaranteed high quality)
    const fallbacks = [
        "1546069901-ba9599a7e63c", // Healthy Bowl
        "1589302168068-964664d93dc0", // Biryani/Rice
        "1601050690597-df056fb4ce79", // Samosa/Snacks
        "1534422298391-e4f8c170db06", // Roti/Paratha
        "1617693324311-20fc4136934c", // Thali
        "1512621776951-a57141f2eefd", // Salad
        "1565557623262-b51c2513a641", // Tandoori
        "1596797038530-2c39bb9ed03c", // Daal/Pulses
        "1506126613408-eca07ce68773", // Yoga/Meditation
        "1515516969-d4008cc6241a", // South Indian/Dosa
        "1626082927389-6cd097cdc6ec"  // Indian Sweets
    ];

    // Pick the best visual match based on dish keywords
    let selectedId = fallbacks[4]; // Default to Thali (versatile)

    if (dishName.includes("yoga") || dishName.includes("pose") || dishName.includes("asana")) {
        selectedId = fallbacks[8]; // Yoga
    } else if (dishName.includes("rice") || dishName.includes("biryani") || dishName.includes("pulao") || dishName.includes("khichdi")) {
        selectedId = fallbacks[1]; // Biryani/Rice
    } else if (dishName.includes("paratha") || dishName.includes("roti") || dishName.includes("bread") || dishName.includes("naan") || dishName.includes("dhuska") || dishName.includes("chilka")) {
        selectedId = fallbacks[3]; // Roti/Bread
    } else if (dishName.includes("pakoda") || dishName.includes("samosa") || dishName.includes("snack") || dishName.includes("vada") || dishName.includes("pitha")) {
        selectedId = fallbacks[2]; // Samosa/Snack
    } else if (dishName.includes("salad") || dishName.includes("bowl") || dishName.includes("fresh") || dishName.includes("healthy") || dishName.includes("fruit")) {
        selectedId = fallbacks[5]; // Salad
    } else if (dishName.includes("grill") || dishName.includes("tikka") || dishName.includes("kebab") || dishName.includes("tandoori")) {
        selectedId = fallbacks[6]; // Tandoori
    } else if (dishName.includes("dosa") || dishName.includes("idli") || dishName.includes("sambar") || dishName.includes("uttapam")) {
        selectedId = fallbacks[9]; // South Indian
    } else if (dishName.includes("dal") || dishName.includes("daal") || dishName.includes("pulses") || dishName.includes("chorchori")) {
        selectedId = fallbacks[7]; // Daal
    } else if (dishName.includes("sweet") || dishName.includes("dessert") || dishName.includes("halwa") || dishName.includes("kheer") || dishName.includes("ladoo")) {
        selectedId = fallbacks[10]; // Sweets
    } else if (dishName.includes("paneer") || dishName.includes("cheese") || dishName.includes("matar") || dishName.includes("palak")) {
        selectedId = fallbacks[4]; // Thali/Curry
    } else if (dishName.includes("amritsari") || dishName.includes("punjabi") || dishName.includes("masala") || dishName.includes("spicy")) {
        selectedId = fallbacks[6]; // Tandoori/Spicy
    } else if (dishName.includes("kulcha") || dishName.includes("bhatoora") || dishName.includes("puri") || dishName.includes("luchi")) {
        selectedId = fallbacks[3]; // Roti/Bread
    } else if (dishName.includes("curry") || dishName.includes("saag") || dishName.includes("gravy") || dishName.includes("sabzi") || dishName.includes("thali") || dishName.includes("bhurji")) {
        selectedId = fallbacks[4]; // Thali
    } else {
        // Deterministic variety picker
        const charSum = query.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        selectedId = fallbacks[charSum % fallbacks.length];
    }

    return `https://images.unsplash.com/photo-${selectedId}?auto=format&fit=crop&q=80&w=1024&h=1024`;
};

/**
 * Generates an image using Google's Imagen (Gemini)
 * 
 * @param prompt The descriptive prompt for image generation
 * @returns A base64 Data URL for the generated image
 */
export async function generateImageWithGemini(prompt: string): Promise<string> {
    const modelName = process.env.GEMINI_IMAGE_MODEL || 'imagen-3.0-generate-001';

    // Skip if we've already detected a restriction or it's explicitly disabled
    if (isAiImageGenRestricted || modelName === 'none' || process.env.SKIP_AI_IMAGE_GEN === 'true') {
        throw new Error("AI Image Generation is restricted or disabled.");
    }

    console.log(`[IMAGE_GEN] Attempting Gemini Image Generation...`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });

        // Google Imagen usually takes a single prompt string for basic generation 
        const result = await (model as any).generateContent(prompt);
        const response = await result.response;

        // Return image data if supported in the specific SDK version
        if (response.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const imageData = response.candidates[0].content.parts[0].inlineData;
            console.log(`[IMAGE_GEN] Gemini Success: Image generated for prompt: "${prompt.substring(0, 50)}..."`);
            return `data:${imageData.mimeType};base64,${imageData.data}`;
        }

        throw new Error("No image data returned from Gemini Imagen.");
    } catch (error: any) {
        const errorMessage = error.message?.toLowerCase() || "";
        const isPaidRestriction = errorMessage.includes("400") ||
            errorMessage.includes("paid plan") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("404") ||
            errorMessage.includes("not supported");

        if (!isPaidRestriction) {
            console.error(`[IMAGE_GEN] Gemini Imagen Error: ${error.message || error}`);
        }
        throw error;
    }
}

/**
 * Generates an image using Pollinations.ai (Free, No Auth)
 * 
 * @param prompt The descriptive prompt for image generation
 * @returns A URL for the generated image
 */
export async function generateImageWithPollinations(prompt: string): Promise<string> {
    // Keep prompt short for URL stability. Pollinations works best with "Subject, Style"
    const cleanPrompt = prompt.toLowerCase()
        .replace(/ultra-realistic|professional|photography|authentic|cuisine|plated|dish|featuring|textures|sharp|focus|appetizing|presentation|no text|no labels|watermarks/gi, '')
        .split('.')[0].split(',')[0].trim();

    const finalPrompt = `Authentic Indian ${cleanPrompt}, food photography, high resolution, appetizing`;
    const encodedPrompt = encodeURIComponent(finalPrompt);
    const seed = Math.floor(Math.random() * 100000);

    // Using a more stable model (flux) and keeping the URL compact
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true`;

    console.log(`[IMAGE_GEN] Pollinations AI Request: ${finalPrompt}`);
    return imageUrl;
}

/**
 * Main image generation interface.
 * Standardized on Google Imagen 3 with curated static fallbacks.
 * 
 * @param prompt The descriptive prompt for image generation
 * @param options Customization options for the generation
 * @returns A base64 Data URL for the generated image or a high-quality fallback URL
 */
export async function generateImage(
    prompt: string,
    options: ImageGenOptions = {}
): Promise<string> {
    // 1. Attempt AI generation using Google Imagen (via Gemini API)
    try {
        if (!isAiImageGenRestricted) {
            return await generateImageWithGemini(prompt);
        }
    } catch (error: any) {
        // Detect if the failure is due to expected API restrictions (e.g. Free Tier)
        const errorMessage = error.message?.toLowerCase() || "";
        const isPaidRestriction = errorMessage.includes("400") ||
            errorMessage.includes("paid plan") ||
            errorMessage.includes("not found") ||
            errorMessage.includes("404") ||
            errorMessage.includes("not supported") ||
            errorMessage.includes("quota exceeded");

        if (isPaidRestriction) {
            if (!isAiImageGenRestricted) {
                console.warn("[IMAGE_GEN] Note: Google Imagen requires a Paid Gemini Plan. Switching to Pollinations AI for free generation.");
                isAiImageGenRestricted = true; // Trip the circuit breaker for Gemini
            }
        }
    }

    // 2. Attempt fallback AI generation using Pollinations.ai (Free)
    try {
        return await generateImageWithPollinations(prompt);
    } catch (error) {
        console.error("[IMAGE_GEN] Pollinations AI failed, using curated library match.", error);
    }

    // 3. Return a high-quality relevant fallback from our curated collection
    return getDynamicFallback(prompt);
}
