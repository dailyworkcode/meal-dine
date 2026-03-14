import { z } from 'zod';

// Multilingual support
export const LocalizedStringSchema = z.object({
  en: z.string().describe('English version.'),
  hi: z.string().describe('Hindi version.'),
});
export type LocalizedString = z.infer<typeof LocalizedStringSchema>;

// For generate-recipe.ts
export const GenerateRecipeInputSchema = z.object({
  dishName: z.string().describe('The name of the dish to generate a recipe for.'),
  language: z.string().optional().describe('The target language (kept for compatibility).'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

export const GenerateRecipeOutputSchema = z.object({
  dishName: LocalizedStringSchema.describe('The name of the dish in multiple languages.'),
  description: LocalizedStringSchema.describe('A brief description in multiple languages.'),
  dishImageUrl: z
    .string()
    .url()
    .describe('A publicly accessible URL for an image of the final dish.'),
  prepTime: LocalizedStringSchema.describe('Preparation time.'),
  cookTime: LocalizedStringSchema.describe('Cooking time.'),
  servings: LocalizedStringSchema.describe('Number of servings.'),
  ingredients: z
    .array(
      z.object({
        name: LocalizedStringSchema.describe('Ingredient name and quantity.'),
      })
    )
    .describe('A list of ingredients.'),
  instructions: z
    .array(LocalizedStringSchema)
    .describe('Step-by-step cooking instructions.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export const RecipeContentSchema = GenerateRecipeOutputSchema.omit({
  dishName: true,
});
export type RecipeContent = z.infer<typeof RecipeContentSchema>;

export const RecipeContentSchemaWithoutImage = RecipeContentSchema.omit({
  dishImageUrl: true,
});
export type RecipeContentWithoutImage = z.infer<
  typeof RecipeContentSchemaWithoutImage
>;

// For generate-daily-meal-suggestions.ts
export const GenerateDailyMealSuggestionsInputSchema = z.object({
  name: z.string().describe('The name of the user.'),
  age: z.number().describe('The age of the user.'),
  dietType: z
    .string()
    .describe(
      'The general diet type of the user (e.g., Normal, Diabetes, PCOS).'
    ),
  country: z.string().describe('The country where the user resides.'),
  region: z.string().describe('The region/state where the user resides.'),
  dietaryPreferences: z
    .string()
    .describe(
      'The dietary preferences of the user, such as vegetarian, vegan, gluten-free, etc.'
    ),
  availableIngredients: z
    .string()
    .describe(
      'A list of ingredients available to the user, separated by commas.'
    ),
  healthGoals: z.string().optional().describe('The user\'s health and fitness goals.'),
  activityLevel: z.string().optional().describe('The user\'s daily activity level.'),
  allergies: z.string().optional().describe('Any food allergies or intolerances.'),
  mealHistory: z
    .string()
    .optional()
    .describe(
      'A list of previously suggested meals, to avoid repetition.  Should be comma separated values, where each value is a meal name and type such as "Breakfast Poha, Lunch Dal Makhani, Dinner Palak Paneer".'
    ),
  language: z
    .string()
    .describe('The target language for the output (e.g., "en", "hi").'),
});
export type GenerateDailyMealSuggestionsInput = z.infer<
  typeof GenerateDailyMealSuggestionsInputSchema
>;

export const MealNamesSchema = z.object({
  breakfast: z.string().describe('Suggestion for breakfast.'),
  lunch: z.string().describe('Suggestion for lunch.'),
  snacks: z.string().describe('Suggestion for snacks.'),
  dinner: z.string().describe('Suggestion for dinner.'),
});

export const GenerateDailyMealSuggestionsOutputSchema = z.object({
  breakfast: GenerateRecipeOutputSchema.describe('Recipe for breakfast.'),
  lunch: GenerateRecipeOutputSchema.describe('Recipe for lunch.'),
  snacks: GenerateRecipeOutputSchema.describe('Recipe for snacks.'),
  dinner: GenerateRecipeOutputSchema.describe('Recipe for dinner.'),
});
export type GenerateDailyMealSuggestionsOutput = z.infer<
  typeof GenerateDailyMealSuggestionsOutputSchema
>;

export const RecipeSchemaWithoutImage = GenerateRecipeOutputSchema.omit({
  dishImageUrl: true,
});
export type RecipeWithoutImage = z.infer<typeof RecipeSchemaWithoutImage>;

export const GenerateDailyMealSuggestionsOutputSchemaWithoutImages = z.object({
  breakfast: RecipeSchemaWithoutImage.describe('Recipe for breakfast.'),
  lunch: RecipeSchemaWithoutImage.describe('Recipe for lunch.'),
  snacks: RecipeSchemaWithoutImage.describe('Recipe for snacks.'),
  dinner: RecipeSchemaWithoutImage.describe('Recipe for dinner.'),
});
export type GenerateDailyMealSuggestionsOutputWithoutImages = z.infer<
  typeof GenerateDailyMealSuggestionsOutputSchemaWithoutImages
>;

// For suggest-alternative-dishes.ts
export const SuggestAlternativeDishesInputSchema = z.object({
  mealType: z
    .enum(['breakfast', 'lunch', 'dinner', 'snacks'])
    .describe('The type of meal for which to suggest alternatives.'),
  dietaryPreferences: z
    .string()
    .describe('The user\u2019s dietary preferences and restrictions.'),
  currentSuggestion: z
    .string()
    .describe('The current meal suggestion that the user wants an alternative for.'),
  language: z
    .string()
    .describe('The target language for the output (e.g., "en", "hi").'),
});
export type SuggestAlternativeDishesInput = z.infer<
  typeof SuggestAlternativeDishesInputSchema
>;

export const SuggestAlternativeDishesOutputSchema = GenerateRecipeOutputSchema;
export type SuggestAlternativeDishesOutput = z.infer<
  typeof SuggestAlternativeDishesOutputSchema
>;

// For refine-meal-suggestions.ts
export const RefineMealSuggestionsInputSchema = z.object({
  mealSuggestions: z.string().describe('The current meal suggestions.'),
  feedback: z.string().describe('The user feedback on the meal suggestions.'),
});
export type RefineMealSuggestionsInput = z.infer<typeof RefineMealSuggestionsInputSchema>;

export const RefineMealSuggestionsOutputSchema = z.object({
  refinedSuggestions: z.string().describe('The refined meal suggestions based on the feedback.'),
});
export type RefineMealSuggestionsOutput = z.infer<typeof RefineMealSuggestionsOutputSchema>;

// For chat-flow.ts
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ChatInputSchema = z.object({
  message: z.string().describe("The user's current message."),
  history: z.array(ChatMessageSchema).describe('The conversation history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

export const ChatOutputSchema = z.object({
  response: z.string().describe("The chatbot's response."),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;
export const YogaPoseSchema = z.object({
  name: LocalizedStringSchema.describe('Name of the yoga pose.'),
  duration: LocalizedStringSchema.describe('Duration (e.g., "2 mins" or "5 breaths").'),
  benefits: LocalizedStringSchema.describe('Key benefits of this pose.'),
  instructions: LocalizedStringSchema.describe('Brief instructions on how to perform the pose.'),
  imageUrl: z.string().url().optional().describe('URL to an image demonstrating the pose.'),
});

export const GenerateYogaSessionInputSchema = z.object({
  name: z.string(),
  age: z.number(),
  healthGoals: z.string().optional(),
  activityLevel: z.string().optional(),
  language: z.string(),
});
export type GenerateYogaSessionInput = z.infer<typeof GenerateYogaSessionInputSchema>;

export const GenerateYogaSessionOutputSchema = z.object({
  title: LocalizedStringSchema.describe('Title of the yoga session (e.g., "Morning Energy Flow").'),
  description: LocalizedStringSchema.describe('Brief description of what this session focuses on.'),
  duration: LocalizedStringSchema.describe('Total duration of the session.'),
  poses: z.array(YogaPoseSchema).describe('List of yoga poses in order.'),
});
export type GenerateYogaSessionOutput = z.infer<typeof GenerateYogaSessionOutputSchema>;
export const WellnessRitualSchema = z.object({
  dayFocus: LocalizedStringSchema.describe('Overall theme or focus of the day.'),
  mealHighlight: LocalizedStringSchema.describe('A suggestion for the most important meal or food focus of the day.'),
  yogaFocus: LocalizedStringSchema.describe('A suggested yoga pose or focus.'),
  mindfulTip: LocalizedStringSchema.describe('A mindful eating or wellness tip.'),
  benefit: LocalizedStringSchema.describe('The primary health benefit of this ritual.'),
});
export type WellnessRitualAI = z.infer<typeof WellnessRitualSchema>;

export const GenerateWellnessRitualInputSchema = z.object({
  name: z.string(),
  age: z.number(),
  dietType: z.string(),
  location: z.string(),
  healthGoals: z.string().optional(),
  activityLevel: z.string().optional(),
  language: z.string(),
});
export type GenerateWellnessRitualInput = z.infer<typeof GenerateWellnessRitualInputSchema>;

export const ZenReflectionSchema = z.object({
  reflection: LocalizedStringSchema.describe('A supportive, empathetic AI reflection response.'),
  somaticTip: LocalizedStringSchema.describe('A physical grounding or somatic awareness suggestion.'),
  affirmation: LocalizedStringSchema.describe('A positive affirmation tailored to the user\'s mood.'),
});
export type ZenReflection = z.infer<typeof ZenReflectionSchema>;

export const GenerateZenReflectionInputSchema = z.object({
  mood: z.string(),
  reflection: z.string(),
  language: z.string(),
});
export type GenerateZenReflectionInput = z.infer<typeof GenerateZenReflectionInputSchema>;

export const FoodRecognitionOutputSchema = z.object({
  dishName: LocalizedStringSchema.describe('Detected name of the dish.'),
  calories: z.number().describe('Estimated total calories.'),
  macros: z.object({
    protein: z.number().describe('Protein in grams.'),
    carbs: z.number().describe('Carbohydrates in grams.'),
    fats: z.number().describe('Fats in grams.'),
  }).describe('Estimated macronutrients.'),
  nutritionScore: z.number().min(1).max(10).describe('Healthiness score from 1 to 10.'),
  healthInsights: LocalizedStringSchema.describe('AI feedback on the nutritional value of this meal.'),
  ingredients: z.array(LocalizedStringSchema).describe('List of detected main ingredients.'),
});
export type FoodRecognitionOutput = z.infer<typeof FoodRecognitionOutputSchema>;
