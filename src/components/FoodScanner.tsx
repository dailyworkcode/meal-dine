'use client';

import * as React from 'react';
import { Camera, Upload, Loader2, Info, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { recognizeFood } from '@/ai/flows/recognize-food';
import { FoodRecognitionOutput } from '@/ai/schemas';
import { getLocalizedValue } from '@/lib/utils';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export function FoodScanner() {
    const locale = useLocale();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [result, setResult] = React.useState<FoodRecognitionOutput | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            setImagePreview(base64);
            const base64Data = base64.split(',')[1];

            setIsAnalyzing(true);
            setResult(null);
            try {
                const data = await recognizeFood(base64Data, file.type, locale);
                setResult(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsAnalyzing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-8">
            <Card className="glass-premium border-none rounded-[3rem] overflow-hidden shadow-2xl">
                <CardContent className="p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Upload/Preview Section */}
                        <div className="space-y-6">
                            <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center group transition-all hover:border-primary/40">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-8 space-y-4">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                            <Camera className="w-10 h-10 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">Capture or Upload</p>
                                            <p className="text-sm text-muted-foreground">Select a photo of your meal to analyze</p>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>

                            <Button className="w-full h-14 rounded-2xl font-bold shadow-lg relative overflow-hidden group">
                                <Upload className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                                New Scan
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </Button>
                        </div>

                        {/* Analysis Section */}
                        <div className="min-h-[400px] flex flex-col">
                            <AnimatePresence mode="wait">
                                {isAnalyzing ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
                                    >
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                        <h3 className="text-2xl font-black font-headline">AI is analyzing...</h3>
                                        <p className="text-muted-foreground">Identifying ingredients and calculating macros</p>
                                    </motion.div>
                                ) : result ? (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex-1 space-y-8"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-primary">
                                                <Sparkles className="w-5 h-5" />
                                                <span className="text-xs font-black uppercase tracking-[0.2em]">Detection Found</span>
                                            </div>
                                            <h3 className="text-4xl font-black font-headline tracking-tight">
                                                {getLocalizedValue(result.dishName, locale)}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Calories</p>
                                                <p className="text-2xl font-black font-headline">{result.calories}</p>
                                            </div>
                                            <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-emerald-600">Protein</p>
                                                <p className="text-2xl font-black font-headline text-emerald-600">{result.macros.protein}g</p>
                                            </div>
                                            <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-blue-600">Carbs</p>
                                                <p className="text-2xl font-black font-headline text-blue-600">{result.macros.carbs}g</p>
                                            </div>
                                            <div className="bg-orange-500/5 p-4 rounded-2xl border border-orange-500/10">
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest text-orange-600">Fats</p>
                                                <p className="text-2xl font-black font-headline text-orange-600">{result.macros.fats}g</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Info className="w-4 h-4 text-primary" />
                                                    <span className="font-bold text-sm">Health Insights</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    {getLocalizedValue(result.healthInsights, locale)}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Detected Ingredients</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {result.ingredients.map((ing, i) => (
                                                        <span key={i} className="px-3 py-1 bg-background border border-primary/10 rounded-full text-xs font-medium flex items-center gap-1">
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                                            {getLocalizedValue(ing, locale)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 text-muted-foreground opacity-50">
                                        <Camera className="w-16 h-16" />
                                        <p className="max-w-[200px]">Upload a photo to see nutritional data displayed here</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
