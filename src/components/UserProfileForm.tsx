'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { UserProfile } from '@/lib/types';
import { useTranslations } from 'next-intl';

const profileFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(1, 'Age must be a positive number.'),
  dietTypeChoice: z
    .enum(['Normal', 'Diabetes', 'PCOS', 'Other', ''])
    .default('Normal'),
  otherDietType: z.string().optional(),
  country: z.string().min(2, 'Country is required.'),
  region: z.string().min(2, 'Region is required.'),
  dietaryPreferencesChoice: z
    .enum(['', 'Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'Other'])
    .default(''),
  otherDietaryPreferences: z.string().optional(),
  availableIngredients: z.string().optional(),
  healthGoals: z.string().optional(),
  activityLevel: z.enum(['', 'Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active']).default(''),
  allergies: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  userProfile?: UserProfile | null;
  onSave: (data: UserProfile) => void;
  onCancel?: () => void;
  isSaving: boolean;
}

const DIET_TYPES: ('Normal' | 'Diabetes' | 'PCOS')[] = [
  'Normal',
  'Diabetes',
  'PCOS',
];
const DIETARY_PREFERENCES: ('Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain')[] = [
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'Jain',
];

export function UserProfileForm({
  userProfile,
  onSave,
  onCancel,
  isSaving,
}: UserProfileFormProps) {
  const t = useTranslations('UserProfileForm');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: React.useMemo(() => {
      if (!userProfile)
        return {
          name: '',
          age: 0,
          dietTypeChoice: 'Normal',
          otherDietType: '',
          country: '',
          region: '',
          dietaryPreferencesChoice: '',
          otherDietaryPreferences: '',
          availableIngredients: '',
          healthGoals: '',
          activityLevel: '',
          allergies: '',
        };

      const initialDietTypeChoice = DIET_TYPES.includes(userProfile.dietType as any)
        ? (userProfile.dietType as 'Normal' | 'Diabetes' | 'PCOS')
        : 'Other';
      const otherDietType = DIET_TYPES.includes(userProfile.dietType as any)
        ? ''
        : userProfile.dietType;

      const initialDietaryPreferencesChoice = DIETARY_PREFERENCES.includes(
        userProfile.dietaryPreferences as any
      )
        ? (userProfile.dietaryPreferences as any)
        : userProfile.dietaryPreferences
          ? 'Other'
          : '';
      const otherDietaryPreferences = DIETARY_PREFERENCES.includes(
        userProfile.dietaryPreferences as any
      )
        ? ''
        : userProfile.dietaryPreferences;

      return {
        name: userProfile.name,
        age: userProfile.age ? Number(userProfile.age) : 0,
        dietTypeChoice: initialDietTypeChoice,
        otherDietType: otherDietType,
        country: userProfile.country,
        region: userProfile.region,
        dietaryPreferencesChoice: initialDietaryPreferencesChoice,
        otherDietaryPreferences: otherDietaryPreferences,
        availableIngredients: userProfile.availableIngredients,
        healthGoals: userProfile.healthGoals || '',
        activityLevel: (userProfile.activityLevel as any) || '',
        allergies: userProfile.allergies || '',
      };
    }, [userProfile]),
  });

  const dietTypeChoice = form.watch('dietTypeChoice');
  const dietaryPreferencesChoice = form.watch('dietaryPreferencesChoice');

  const handleSubmit = (values: ProfileFormValues) => {
    const finalDietType =
      values.dietTypeChoice === 'Other'
        ? values.otherDietType!
        : values.dietTypeChoice;
    const finalDietaryPreferences =
      values.dietaryPreferencesChoice === 'Other'
        ? values.otherDietaryPreferences!
        : values.dietaryPreferencesChoice;

    onSave({
      name: values.name,
      age: String(values.age),
      dietType: finalDietType,
      country: values.country,
      region: values.region,
      dietaryPreferences: finalDietaryPreferences,
      availableIngredients: values.availableIngredients || '',
      healthGoals: values.healthGoals || '',
      activityLevel: values.activityLevel || '',
      allergies: values.allergies || '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('nameLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('namePlaceholder')} {...field} />
                </FormControl>
                <FormMessage>{form.formState.errors.name && t('nameError')}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('ageLabel')}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder={t('agePlaceholder')}
                    {...field}
                    value={field.value === 0 ? '' : field.value}
                  />
                </FormControl>
                <FormMessage>{form.formState.errors.age && t('ageError')}</FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('countryLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('countryPlaceholder')} {...field} />
                </FormControl>
                <FormMessage>{form.formState.errors.country && t('countryError')}</FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('regionLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('regionPlaceholder')} {...field} />
                </FormControl>
                <FormMessage>{form.formState.errors.region && t('regionError')}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dietTypeChoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('dietTypeLabel')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('dietTypePlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Normal">{t('normalDiet')}</SelectItem>
                  <SelectItem value="Diabetes">{t('diabetesDiet')}</SelectItem>
                  <SelectItem value="PCOS">{t('pcosDiet')}</SelectItem>
                  <SelectItem value="Other">{t('otherDiet')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {dietTypeChoice === 'Other' && (
          <FormField
            control={form.control}
            name="otherDietType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('specifyDietLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('specifyDietPlaceholder')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="dietaryPreferencesChoice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('dietaryPreferencesLabel')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('dietaryPreferencesPlaceholder')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Vegetarian">{t('vegetarian')}</SelectItem>
                  <SelectItem value="Non-Vegetarian">{t('nonVegetarian')}</SelectItem>
                  <SelectItem value="Vegan">{t('vegan')}</SelectItem>
                  <SelectItem value="Jain">{t('jain')}</SelectItem>
                  <SelectItem value="Other">{t('otherPreferences')}</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {t('dietaryPreferencesDescription')}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {dietaryPreferencesChoice === 'Other' && (
          <FormField
            control={form.control}
            name="otherDietaryPreferences"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('specifyPreferencesLabel')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('specifyPreferencesPlaceholder')}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="availableIngredients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('availableIngredientsLabel')}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t('availableIngredientsPlaceholder')}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>{t('availableIngredientsDescription')}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              {t('cancelButton')}
            </Button>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? t('savingButton') : t('saveButton')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
