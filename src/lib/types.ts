export type MealPlan = {
  breakfast: string;
  lunch: string;
  snacks: string;
  dinner: string;
};

export type MealType = keyof MealPlan;

export type UserProfile = {
  name: string;
  age: string;
  dietType: string;
  country: string;
  region: string;
  dietaryPreferences: string;
  availableIngredients: string;
  healthGoals?: string;
  activityLevel?: string;
  allergies?: string;
  xp?: number;
  level?: number;
};

export type LocalizedString = {
  en: string;
  hi: string;
};

export type Recipe = {
  dishName: LocalizedString;
  description: LocalizedString;
  dishImageUrl?: string;
  prepTime: LocalizedString;
  cookTime: LocalizedString;
  servings: LocalizedString;
  ingredients: {
    name: LocalizedString;
  }[];
  instructions: LocalizedString[];
};

export type MealPlanWithRecipes = {
  breakfast: Recipe;
  lunch: Recipe;
  snacks: Recipe;
  dinner: Recipe;
};

export type WellnessRitual = {
  dayFocus: LocalizedString;
  mealHighlight: LocalizedString;
  yogaFocus: LocalizedString;
  mindfulTip: LocalizedString;
  benefit: LocalizedString;
};

export type JournalEntry = {
  mood: string;
  reflection: string;
  aiResponse: LocalizedString;
  timestamp: string;
};
