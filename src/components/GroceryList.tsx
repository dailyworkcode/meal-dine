'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { ShoppingCart, Download, Copy, CheckCircle2, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { MealPlanWithRecipes, Recipe } from '@/lib/types';
import { getLocalizedValue } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { optimizeGrocery, OptimizedGroceryOutput } from '@/ai/flows/optimize-grocery';
import { motion, AnimatePresence } from 'framer-motion';

interface GroceryListProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mealPlan: MealPlanWithRecipes | null;
}

export function GroceryList({ open, onOpenChange, mealPlan }: GroceryListProps) {
  const t = useTranslations('GroceryList');
  const locale = useLocale();
  const { toast } = useToast();
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [optimizedData, setOptimizedData] = React.useState<OptimizedGroceryOutput | null>(null);

  const ingredients = React.useMemo(() => {
    if (!mealPlan) return [];

    const allIngredients = [
      ...mealPlan.breakfast.ingredients,
      ...mealPlan.lunch.ingredients,
      ...mealPlan.snacks.ingredients,
      ...mealPlan.dinner.ingredients,
    ];

    const seen = new Set();
    return allIngredients.filter(item => {
      const name = item.name.en.toLowerCase().trim();
      if (seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  }, [mealPlan]);

  const handleOptimize = async () => {
    if (ingredients.length === 0) return;
    setIsOptimizing(true);
    try {
      const data = await optimizeGrocery(ingredients, locale);
      setOptimizedData(data);
    } catch (err) {
      console.error(err);
      toast({
        title: "Optimization Failed",
        description: "Could not categorize ingredients at this time.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const toggleItem = (name: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const copyToClipboard = () => {
    let listText = "";
    if (optimizedData) {
      listText = optimizedData.categories.map(cat =>
        `[${getLocalizedValue(cat.name, locale)}]\n` +
        cat.items.map(i => `- ${getLocalizedValue(i.name, locale)} (${getLocalizedValue(i.estimatedQuantity, locale)})`).join('\n')
      ).join('\n\n');
    } else {
      listText = ingredients
        .map(i => `- ${getLocalizedValue(i.name, locale)}`)
        .join('\n');
    }

    navigator.clipboard.writeText(listText);
    toast({
      title: "List Copied!",
      description: "Grocery list has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
        <div className="bg-primary p-8 text-primary-foreground relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black font-headline">
                    {t('title')}
                  </DialogTitle>
                  <DialogDescription className="text-primary-foreground/80 font-medium">
                    {t('description')}
                  </DialogDescription>
                </div>
              </div>
              {!optimizedData && ingredients.length > 0 && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-xl font-bold gap-2 animate-pulse shadow-xl"
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                >
                  {isOptimizing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Smart Optimize
                </Button>
              )}
            </div>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6">
          <ScrollArea className="h-[50vh] pr-4">
            <div className="space-y-8">
              {isOptimizing ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                  <p className="font-bold">Organizing your kitchen...</p>
                </div>
              ) : optimizedData ? (
                optimizedData.categories.map((cat, catIdx) => (
                  <div key={catIdx} className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary flex items-center gap-2">
                      {getLocalizedValue(cat.name, locale)}
                      <div className="h-px flex-1 bg-primary/10" />
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cat.items.map((item, itemIdx) => {
                        const name = getLocalizedValue(item.name, locale);
                        const isChecked = checkedItems[name];
                        return (
                          <div
                            key={itemIdx}
                            className={`flex flex-col p-4 rounded-2xl transition-all border ${isChecked
                                ? 'bg-primary/5 border-primary/20 opacity-60'
                                : 'bg-secondary/30 border-transparent hover:border-primary/10'
                              }`}
                            onClick={() => toggleItem(name)}
                          >
                            <div className="flex items-center gap-3">
                              <Checkbox
                                id={`item-${catIdx}-${itemIdx}`}
                                checked={isChecked}
                                className="rounded-lg h-5 w-5 border-2"
                              />
                              <div className="flex-1">
                                <p className={`text-sm font-bold ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                                  {name}
                                </p>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                                  {getLocalizedValue(item.estimatedQuantity, locale)}
                                </p>
                              </div>
                            </div>
                            {item.substitutes.length > 0 && !isChecked && (
                              <div className="mt-3 pt-3 border-t border-primary/5">
                                <p className="text-[9px] font-black text-primary uppercase tracking-[0.1em] mb-1">Substitutes:</p>
                                <div className="flex flex-wrap gap-1">
                                  {item.substitutes.map((sub, sIdx) => (
                                    <span key={sIdx} className="text-[10px] bg-primary/5 text-primary/70 px-2 py-0.5 rounded-full font-bold">
                                      {getLocalizedValue(sub, locale)}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              ) : ingredients.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ingredients.map((item, idx) => {
                    const name = getLocalizedValue(item.name, locale);
                    const isChecked = checkedItems[name];

                    return (
                      <div
                        key={idx}
                        className={`flex items-center space-x-3 p-4 rounded-2xl transition-all border ${isChecked
                            ? 'bg-primary/5 border-primary/20 opacity-60'
                            : 'bg-secondary/30 border-transparent hover:border-primary/10'
                          }`}
                        onClick={() => toggleItem(name)}
                      >
                        <Checkbox
                          id={`item-${idx}`}
                          checked={isChecked}
                          className="rounded-lg h-5 w-5 border-2"
                        />
                        <label className={`text-sm font-bold flex-1 cursor-pointer select-none ${isChecked ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}>
                          {name}
                        </label>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-muted-foreground opacity-50 space-y-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <ShoppingCart className="w-8 h-8" />
                  </div>
                  <p className="font-bold">No ingredients found. Generate a plan first!</p>
                </div>
              )}
            </div>
          </ScrollArea>

          <footer className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="rounded-2xl h-14 gap-2 border-primary/20 text-md font-bold"
              onClick={copyToClipboard}
              disabled={ingredients.length === 0}
            >
              <Copy className="w-5 h-5" />
              {t('copy')}
            </Button>
            <Button
              className="rounded-2xl h-14 gap-2 shadow-xl shadow-primary/20 text-md font-bold"
              onClick={() => onOpenChange(false)}
            >
              Done <ArrowRight className="w-5 h-5" />
            </Button>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
