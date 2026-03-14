'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { Recipe } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Clock, Users, Flame, Sparkles, Send, Loader2, ShoppingCart } from 'lucide-react';
import { getLocalizedValue } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { refineRecipe } from '@/ai/flows/refine-recipe';
import { useToast } from '@/hooks/use-toast';
import { getGroceryLink } from '@/lib/affiliate';

interface RecipeDialogProps {
  recipe: Recipe | null;
  isLoading: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecipeUpdate?: (mealType: string, updatedRecipe: Recipe) => void;
  mealType?: string;
}

export function RecipeDialog({
  recipe,
  isLoading,
  open,
  onOpenChange,
  onRecipeUpdate,
  mealType,
}: RecipeDialogProps) {
  const t = useTranslations('RecipeDialog');
  const tr = useTranslations('RecipeRefiner');
  const locale = useLocale() as 'en' | 'hi';
  const { toast } = useToast();
  const [feedback, setFeedback] = React.useState('');
  const [isRefining, setIsRefining] = React.useState(false);

  const handleRefine = async () => {
    if (!recipe || !feedback) return;
    setIsRefining(true);
    try {
      const refined = await refineRecipe(recipe, feedback, locale);
      if (onRecipeUpdate && mealType) {
        onRecipeUpdate(mealType, { ...recipe, ...refined });
      }
      setFeedback('');
      toast({
        title: tr('success'),
        description: "Recipe has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: tr('error'),
        description: "Could not refine recipe. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[95vh] max-w-4xl overflow-hidden flex flex-col p-0 rounded-[2.5rem] border-none">
        <ScrollArea className="flex-1">
          <div className="p-8 pb-32">
            {isLoading ? (
              <div className="space-y-8 animate-pulse">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4 rounded-2xl" />
                  <Skeleton className="h-4 w-full rounded-full" />
                  <Skeleton className="h-4 w-5/6 rounded-full" />
                </div>
                <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
                <div className="flex gap-8">
                  <Skeleton className="h-12 w-24 rounded-2xl" />
                  <Skeleton className="h-12 w-24 rounded-2xl" />
                  <Skeleton className="h-12 w-24 rounded-2xl" />
                </div>
              </div>
            ) : recipe ? (
              <div className="space-y-10">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="text-5xl font-black font-headline tracking-tighter text-foreground leading-[1.1]">
                    {getLocalizedValue(recipe.dishName, locale)}
                  </DialogTitle>
                  <DialogDescription className="text-xl font-medium text-muted-foreground leading-relaxed max-w-2xl">
                    {getLocalizedValue(recipe.description, locale)}
                  </DialogDescription>
                </DialogHeader>

                {recipe.dishImageUrl && (
                  <div className="relative group overflow-hidden rounded-[3rem] border border-primary/10 shadow-3xl">
                    <Image
                      src={recipe.dishImageUrl}
                      alt={getLocalizedValue(recipe.dishName, locale)}
                      width={1200}
                      height={800}
                      className="aspect-video w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-10 py-6 border-y border-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600 shadow-sm">
                      <Clock className="size-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1">{t('prepTime')}</p>
                      <p className="text-lg font-bold text-foreground">{getLocalizedValue(recipe.prepTime, locale)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-600 shadow-sm">
                      <Flame className="size-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1">{t('cookTime')}</p>
                      <p className="text-lg font-bold text-foreground">{getLocalizedValue(recipe.cookTime, locale)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-600 shadow-sm">
                      <Users className="size-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 leading-none mb-1">{t('servings')}</p>
                      <p className="text-lg font-bold text-foreground">{getLocalizedValue(recipe.servings, locale)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-2 bg-primary rounded-full" />
                        <h3 className="text-2xl font-black font-headline uppercase tracking-tight text-foreground">
                          {t('ingredients')}
                        </h3>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-primary/20 hover:bg-primary/5 font-bold"
                        onClick={() => window.open(getGroceryLink(getLocalizedValue(recipe.dishName, locale)), '_blank')}
                      >
                        <ShoppingCart className="mr-2 size-4" />
                        Buy Ingredients
                      </Button>
                    </div>
                    <ul className="space-y-4">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-primary/5 group hover:bg-secondary/50 transition-colors">
                          <span className="mt-1.5 size-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                          <span className="text-md font-bold text-foreground/80 leading-snug">
                            {getLocalizedValue(ingredient.name, locale)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-2 bg-primary rounded-full" />
                      <h3 className="text-2xl font-black font-headline uppercase tracking-tight text-foreground">
                        {t('instructions')}
                      </h3>
                    </div>
                    <ol className="space-y-8">
                      {recipe.instructions.map((step, index) => (
                        <li key={index} className="flex gap-6 group">
                          <span className="flex-shrink-0 size-10 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-sm font-black text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            {index + 1}
                          </span>
                          <p className="text-lg font-medium text-muted-foreground leading-relaxed pt-1.5 group-hover:text-foreground transition-colors">
                            {getLocalizedValue(step, locale)}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </ScrollArea>

        {!isLoading && recipe && (
          <div className="absolute bottom-0 left-0 right-0 p-8 pt-10 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-md">
            <div className="max-w-2xl mx-auto space-y-4 relative">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary bg-primary/10 w-fit px-4 py-1.5 rounded-full border border-primary/20 mb-2">
                <Sparkles className="size-3 animate-pulse" />
                {tr('title')}
              </div>
              <div className="flex gap-4 p-2 bg-background border border-primary/10 rounded-[2rem] shadow-2xl">
                <Input
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={tr('placeholder')}
                  className="flex-1 rounded-2xl h-14 bg-transparent border-none focus-visible:ring-0 text-lg font-medium px-4"
                  onKeyDown={(e) => e.key === 'Enter' && handleRefine()}
                />
                <Button
                  onClick={handleRefine}
                  disabled={!feedback || isRefining}
                  className="rounded-2xl h-14 px-10 text-md font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all group"
                >
                  {isRefining ? <Loader2 className="size-5 animate-spin mr-2" /> : <Send className="size-5 mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  {isRefining ? tr('refining') : tr('button')}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
