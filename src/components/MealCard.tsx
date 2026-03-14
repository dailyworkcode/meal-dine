'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  Coffee,
  Loader2,
  Moon,
  Shuffle,
  Sun,
  Sunrise,
} from 'lucide-react';
import Image from 'next/image';
import type { MealType } from '@/lib/types';
import { useTranslations } from 'next-intl';

interface MealCardProps {
  mealType?: MealType;
  dishName?: string;
  dishImageUrl?: string;
  onSuggestAlternative?: (mealType: MealType) => void;
  onGetRecipe?: (dishName: string) => void;
  isLoading?: boolean;
  isGettingRecipe?: boolean;
  className?: string;
}

const mealIcons: Record<MealType, React.ElementType> = {
  breakfast: Sunrise,
  lunch: Sun,
  snacks: Coffee,
  dinner: Moon,
};

export default function MealCard({
  mealType = 'breakfast',
  dishName,
  dishImageUrl,
  onSuggestAlternative,
  onGetRecipe,
  isLoading = false,
  isGettingRecipe = false,
  className,
}: MealCardProps) {
  const t = useTranslations('MealCard');
  const Icon = mealIcons[mealType];
  const title = t(mealType);
  const placeholderImage = PlaceHolderImages.find(p => p.id === mealType);
  const imageUrl = dishImageUrl || placeholderImage?.imageUrl;

  const handleGetRecipe = () => {
    if (onGetRecipe && dishName) {
      onGetRecipe(dishName);
    }
  };

  const handleSuggestAlternative = () => {
    if (onSuggestAlternative) {
      onSuggestAlternative(mealType);
    }
  };

  if (isLoading) {
    return (
      <Card className={cn('flex flex-col', className)}>
        <CardHeader>
          <Skeleton className="h-7 w-32" />
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <Skeleton className="aspect-[3/2] w-full" />
          <Skeleton className="h-6 w-3/4" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'transform-transform flex flex-col overflow-hidden shadow-lg transition-transform hover:-translate-y-1',
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-xl font-bold">
          <Icon className="size-6 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4 text-center">
        {imageUrl && (
          <div className="overflow-hidden rounded-lg bg-muted">
            <img
              src={imageUrl}
              alt={dishName || placeholderImage?.description || 'Meal image'}
              className="aspect-[3/2] w-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (placeholderImage?.imageUrl && target.src !== placeholderImage.imageUrl) {
                  target.src = placeholderImage.imageUrl;
                }
              }}
            />
          </div>
        )}
        <p className="font-body text-2xl font-semibold">{dishName}</p>
      </CardContent>
      <CardFooter className="flex flex-col justify-between gap-2 bg-muted/50 p-4 sm:flex-row">
        <Button
          variant="outline"
          onClick={handleGetRecipe}
          className="w-full sm:w-auto"
          disabled={isGettingRecipe || isLoading}
        >
          {isGettingRecipe ? <Loader2 className="animate-spin" /> : <BookOpen />}
          {t('getRecipeButton')}
        </Button>
        <Button
          onClick={handleSuggestAlternative}
          disabled={isLoading || isGettingRecipe}
          className="w-full sm:w-auto"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Shuffle />}
          {t('tryAnotherButton')}
        </Button>
      </CardFooter>
    </Card>
  );
}
