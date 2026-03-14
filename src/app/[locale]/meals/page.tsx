'use client';

import * as React from 'react';
import { suggestAlternativeDishes } from '@/ai/flows/suggest-alternative-dishes';
import { generateDailyMealSuggestions } from '@/ai/flows/generate-daily-meal-suggestions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import type {
  MealPlanWithRecipes,
  MealType,
  UserProfile,
  Recipe,
} from '@/lib/types';
import { cn, getLocalizedValue, getTodayKey } from '@/lib/utils';
import { Logo } from '@/components/icons';
import MealCard from '@/components/MealCard';
import {
  AlertTriangle,
  Loader2,
  Salad,
  User,
  Utensils,
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { UserProfileForm } from '@/components/UserProfileForm';
import { RecipeDialog } from '@/components/RecipeDialog';
import { ChatBot } from '@/components/ChatBot';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { saveMealPlan, getMealPlan, cleanupOldPlans } from '@/lib/storage';
import { Magnetic } from '@/components/Magnetic';
import { GlassParallax } from '@/components/GlassParallax';
import { useChronoTheme } from '@/components/ChronoThemeProvider';
import { WellnessRitualLoader } from '@/components/WellnessRitualLoader';
import { GroceryList } from '@/components/GroceryList';
import { ShoppingBasket } from 'lucide-react';

export default function Home() {
  const t = useTranslations('HomePage');
  const tDialog = useTranslations('UserProfileDialog');
  const { timeLabel } = useChronoTheme();
  const locale = useLocale();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const [isGeneratingAlternative, setIsGeneratingAlternative] = React.useState<
    MealType | false
  >(false);
  const [error, setError] = React.useState<string | null>(null);

  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>(
    'userProfile',
    null
  );
  const [mealHistory, setMealHistory] = useLocalStorage<string[]>(
    'mealHistory',
    []
  );
  const [todaysPlan, setTodaysPlan] = useLocalStorage<MealPlanWithRecipes | null>('todaysPlan', null);

  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const [activeMealType, setActiveMealType] = React.useState<MealType | null>(null);
  const [isRecipeDialogOpen, setIsRecipeDialogOpen] = React.useState(false);
  const [isGroceryListOpen, setIsGroceryListOpen] = React.useState(false);

  const [hasCheckedProfile, setHasCheckedProfile] = React.useState(false);

  // Storage cleanup and initial load effect
  React.useEffect(() => {
    const initStorage = async () => {
      const today = getTodayKey();
      await cleanupOldPlans(today);
      const savedPlan = await getMealPlan(today);
      if (savedPlan) {
        setTodaysPlan(savedPlan);
      }
    };
    initStorage();
  }, []);

  // Update effect to only open dialog if profile is truly missing after mount
  React.useEffect(() => {
    if (userProfile === null && hasCheckedProfile) {
      setIsProfileOpen(true);
    }
  }, [userProfile, hasCheckedProfile]);

  // Handle the initial check from localStorage
  React.useEffect(() => {
    setHasCheckedProfile(true);
  }, []);

  const handleSaveProfile = async (data: UserProfile) => {
    setIsSavingProfile(true);
    setUserProfile(data);
    setIsSavingProfile(false);
    setIsProfileOpen(false);
    toast({
      title: 'Profile Saved!',
      description: 'Your profile has been updated.',
    });
  };

  const handleGeneratePlan = async () => {
    if (!userProfile) {
      toast({
        variant: 'destructive',
        title: t('profileNotSetError'),
        description: t('profileNotSetDesc'),
      });
      setIsProfileOpen(true);
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateDailyMealSuggestions({
        ...userProfile,
        age: parseInt(userProfile.age, 10),
        healthGoals: userProfile.healthGoals,
        activityLevel: userProfile.activityLevel,
        allergies: userProfile.allergies,
        mealHistory: mealHistory.join(', '),
        language: locale,
      });

      setTodaysPlan(result);
      await saveMealPlan(getTodayKey(), result);

      // Add new meals to history to avoid future repetition
      const newHistory = [
        ...mealHistory,
        ...Object.values(result).map(r => getLocalizedValue(r.dishName, 'en')), // History still uses EN for consistency
      ];
      // Keep history to a reasonable size
      setMealHistory(newHistory.slice(-50));
    } catch (e: any) {
      const errorMessage = t('generateError');
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: t('errorTitle'),
        description: e.message || errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSuggestAlternative = async (mealType: MealType) => {
    if (!todaysPlan || !userProfile) return;
    setIsGeneratingAlternative(mealType);
    setError(null);

    try {
      const newRecipe = await suggestAlternativeDishes({
        mealType,
        dietaryPreferences: userProfile.dietaryPreferences,
        currentSuggestion: getLocalizedValue(todaysPlan[mealType].dishName, 'en'),
        language: locale,
      });

      if (newRecipe && newRecipe.dishName) {
        const newPlan = {
          ...todaysPlan,
          [mealType]: newRecipe,
        };

        setTodaysPlan(newPlan);
        await saveMealPlan(getTodayKey(), newPlan);

        // Update history as well
        const newHistory = [...mealHistory, getLocalizedValue(newRecipe.dishName, 'en')];
        setMealHistory(newHistory.slice(-50));
      } else {
        toast({
          title: t('noAlternativeToast'),
          description: t('noAlternativeToastDesc'),
        });
      }
    } catch (e: any) {
      const errorMessage = t('alternativeError');
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: t('errorTitle'),
        description: e.message || errorMessage,
      });
    } finally {
      setIsGeneratingAlternative(false);
    }
  };

  const handleGetRecipe = (dishName: string) => {
    if (!todaysPlan) return;

    const mealTuple = Object.entries(todaysPlan).find(
      ([type, meal]) =>
        getLocalizedValue(meal.dishName, locale) === dishName ||
        getLocalizedValue(meal.dishName, 'en') === dishName ||
        getLocalizedValue(meal.dishName, 'hi') === dishName
    );

    if (mealTuple) {
      setRecipe(mealTuple[1]);
      setActiveMealType(mealTuple[0] as MealType);
      setIsRecipeDialogOpen(true);
    } else {
      toast({
        variant: 'destructive',
        title: t('recipeNotFoundError'),
        description: t('recipeNotFoundDesc'),
      });
    }
  };

  const handleRecipeDialogChange = (open: boolean) => {
    setIsRecipeDialogOpen(open);
    if (!open) {
      setRecipe(null);
      setActiveMealType(null);
    }
  };

  const handleRecipeUpdate = async (type: string, updatedRecipe: Recipe) => {
    if (!todaysPlan) return;
    const newPlan = {
      ...todaysPlan,
      [type]: updatedRecipe,
    };
    setTodaysPlan(newPlan);
    setRecipe(updatedRecipe); // Update local view as well
    await saveMealPlan(getTodayKey(), newPlan);
  };

  return (
    <SidebarProvider>
      {isGenerating && <WellnessRitualLoader />}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {userProfile ? tDialog('editTitle') : tDialog('welcomeTitle')}
            </DialogTitle>
            <DialogDescription>
              {userProfile
                ? tDialog('editDescription')
                : tDialog('welcomeDescription')}
            </DialogDescription>
          </DialogHeader>
          <UserProfileForm
            userProfile={userProfile}
            onSave={handleSaveProfile}
            onCancel={() => userProfile && setIsProfileOpen(false)} // only show cancel if profile exists
            isSaving={isSavingProfile}
          />
        </DialogContent>
      </Dialog>
      <RecipeDialog
        open={isRecipeDialogOpen}
        onOpenChange={handleRecipeDialogChange}
        recipe={recipe}
        isLoading={!recipe}
        mealType={activeMealType || undefined}
        onRecipeUpdate={handleRecipeUpdate}
      />
      <GroceryList
        open={isGroceryListOpen}
        onOpenChange={setIsGroceryListOpen}
        mealPlan={todaysPlan}
      />

      <Sidebar side="left" collapsible="icon" className="bg-transparent border-r border-primary/10">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-primary group-data-[collapsible=icon]:hidden">
              DailyDine
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-4 bg-transparent backdrop-blur-md">
          <div className="rounded-[2rem] glass-card p-6 border-white/10 shadow-xl">
            {userProfile ? (
              <div className="space-y-4">
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center gap-2 text-lg">
                    <User className="size-5" /> {t('profileTitle')}
                  </SidebarGroupLabel>
                  <div className="space-y-2 text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                    <p>
                      <span className="font-semibold text-foreground">{t('nameLabel')}</span>{' '}
                      {userProfile.name}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">{t('ageLabel')}</span>{' '}
                      {userProfile.age}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">
                        {t('dietTypeLabel')}
                      </span>{' '}
                      {userProfile.dietType}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">
                        {t('locationLabel')}
                      </span>{' '}
                      {userProfile.region}, {userProfile.country}
                    </p>
                  </div>
                </SidebarGroup>
                <Magnetic>
                  <Button
                    variant="outline"
                    className="w-full rounded-xl border-primary/20 bg-background/50 backdrop-blur-sm"
                    onClick={() => setIsProfileOpen(true)}
                  >
                    {t('editProfileButton')}
                  </Button>
                </Magnetic>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
                Please set up your profile to get started.
              </div>
            )}
          </div>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="relative">
        <GlassParallax />
        <main className="min-h-screen flex-1 p-4 md:p-8 bg-transparent selection:bg-primary/30 selection:text-primary-foreground">
          <header className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <h2 className="text-2xl font-bold font-headline md:text-3xl">
                {t('title')}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              <div className="hidden md:block">
                <div className="flex items-center gap-3">
                  {todaysPlan && (
                    <Magnetic strength={0.2}>
                      <Button
                        variant="outline"
                        onClick={() => setIsGroceryListOpen(true)}
                        className="rounded-2xl px-6 h-12 border-primary/20 bg-background/50"
                        size="lg"
                      >
                        <ShoppingBasket className="mr-2 h-5 w-5" />
                        {locale === 'hi' ? 'किराने की सूची' : 'Grocery List'}
                      </Button>
                    </Magnetic>
                  )}
                  <Magnetic strength={0.2}>
                    <Button
                      onClick={handleGeneratePlan}
                      className="w-full rounded-2xl px-8 h-12 shadow-lg shadow-primary/20"
                      disabled={isGenerating || !userProfile}
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('generatingButton')}
                        </>
                      ) : (
                        t('generateButton')
                      )}
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </header>

          {error && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{t('errorTitle')}</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div
            className={cn(
              'grid gap-6 md:gap-8',
              todaysPlan
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
                : 'grid-cols-1'
            )}
          >
            {isGenerating ? (
              <>
                <MealCard isLoading />
                <MealCard isLoading />
                <MealCard isLoading />
                <MealCard isLoading />
              </>
            ) : todaysPlan ? (
              <>
                <MealCard
                  mealType="breakfast"
                  dishName={getLocalizedValue(todaysPlan.breakfast.dishName, locale)}
                  dishImageUrl={todaysPlan.breakfast.dishImageUrl}
                  onSuggestAlternative={handleSuggestAlternative}
                  onGetRecipe={handleGetRecipe}
                  isLoading={isGeneratingAlternative === 'breakfast'}
                  isGettingRecipe={false}
                  className="duration-500 animate-in fade-in slide-in-from-bottom-4"
                />
                <MealCard
                  mealType="lunch"
                  dishName={getLocalizedValue(todaysPlan.lunch.dishName, locale)}
                  dishImageUrl={todaysPlan.lunch.dishImageUrl}
                  onSuggestAlternative={handleSuggestAlternative}
                  onGetRecipe={handleGetRecipe}
                  isLoading={isGeneratingAlternative === 'lunch'}
                  isGettingRecipe={false}
                  className="duration-500 delay-100 animate-in fade-in slide-in-from-bottom-4"
                />
                <MealCard
                  mealType="snacks"
                  dishName={getLocalizedValue(todaysPlan.snacks.dishName, locale)}
                  dishImageUrl={todaysPlan.snacks.dishImageUrl}
                  onSuggestAlternative={handleSuggestAlternative}
                  onGetRecipe={handleGetRecipe}
                  isLoading={isGeneratingAlternative === 'snacks'}
                  isGettingRecipe={false}
                  className="duration-500 delay-200 animate-in fade-in slide-in-from-bottom-4"
                />
                <MealCard
                  mealType="dinner"
                  dishName={getLocalizedValue(todaysPlan.dinner.dishName, locale)}
                  dishImageUrl={todaysPlan.dinner.dishImageUrl}
                  onSuggestAlternative={handleSuggestAlternative}
                  onGetRecipe={handleGetRecipe}
                  isLoading={isGeneratingAlternative === 'dinner'}
                  isGettingRecipe={false}
                  className="duration-500 delay-300 animate-in fade-in slide-in-from-bottom-4"
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[3rem] border border-primary/10 glass-card p-12 text-center xl:col-span-4">
                {userProfile ? (
                  <>
                    <Utensils className="size-16 text-primary mb-4 animate-float" />
                    <h3 className="mb-2 text-2xl font-bold font-headline">
                      {t('readyForPlanTitle')}
                    </h3>
                    <p className="mb-6 max-w-md text-muted-foreground">
                      {t('readyForPlanDesc')}
                    </p>
                    <Magnetic strength={0.3}>
                      <Button
                        onClick={handleGeneratePlan}
                        disabled={isGenerating}
                        size="lg"
                        className="rounded-2xl px-12 h-14"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t('generatingButton')}
                          </>
                        ) : (
                          t('generateButton')
                        )}
                      </Button>
                    </Magnetic>
                  </>
                ) : (
                  <>
                    <Salad className="size-16 text-primary mb-4 animate-float" />
                    <h3 className="mb-2 text-2xl font-bold font-headline">
                      {t('welcomeTitle')}
                    </h3>
                    <p className="mb-6 max-w-md text-muted-foreground">
                      {t('welcomeDesc')}
                    </p>
                    <Magnetic strength={0.3}>
                      <Button onClick={() => setIsProfileOpen(true)} className="rounded-2xl px-12 h-14">
                        {t('setupProfileButton')}
                      </Button>
                    </Magnetic>
                  </>
                )}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
      <ChatBot />
    </SidebarProvider>
  );
}
