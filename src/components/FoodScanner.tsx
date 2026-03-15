'use client';

import * as React from 'react';
import { Camera, Upload, Loader2, Info, Sparkles, CheckCircle2, Type, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { recognizeFood } from '@/ai/flows/recognize-food';
import { FoodRecognitionOutput } from '@/ai/schemas';
import { getLocalizedValue, cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export function FoodScanner() {
    const t = useTranslations('FoodScanner');
    const locale = useLocale();
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);
    const [result, setResult] = React.useState<FoodRecognitionOutput | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [textInput, setTextInput] = React.useState('');

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

    const handleTextSubmit = async () => {
        if (!textInput.trim()) return;
        setIsAnalyzing(true);
        setResult(null);
        setImagePreview(null);
        try {
            // We pass the raw text as data, set type to text/plain
            const data = await recognizeFood(textInput, 'text/plain', locale);
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8">
            <Card className="glass-premium border-none rounded-[3rem] overflow-hidden shadow-2xl">
                <CardContent className="p-6 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Upload/Preview Section */}
                        <div className="space-y-6">
                            {/* Image Preview / Upload Box */}
                            <div className="relative aspect-video md:aspect-square rounded-[2rem] overflow-hidden bg-primary/5 border-2 border-dashed border-primary/20 flex flex-col items-center justify-center group transition-all hover:border-primary/40">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-8 space-y-4">
                                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                            <Camera className="w-10 h-10 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg">{t('uploadTitle')}</p>
                                            <p className="text-sm text-muted-foreground">{t('uploadDesc')}</p>
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

                            {/* Action Buttons for Image */}
                            {!isAnalyzing && (
                                <div className="grid grid-cols-2 gap-2 md:gap-4 group">
                                    <Button 
                                        variant="outline"
                                        className="h-14 md:h-16 rounded-2xl font-bold shadow-sm flex flex-col gap-1 items-center justify-center relative overflow-hidden group p-2 col-span-2 md:col-span-2"
                                    >
                                        <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                                        <span className="text-[10px] md:text-xs">Gallery</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                    </Button>
                                    
                                    <Button 
                                        variant="outline"
                                        className="h-14 rounded-2xl font-bold shadow-sm flex flex-col gap-1 items-center justify-center relative overflow-hidden group p-2 col-span-2 md:hidden"
                                    >
                                        <Camera className="w-5 h-5 transition-transform group-hover:-translate-y-1" />
                                        <span className="text-[10px] md:text-xs">Camera</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={handleFileUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        />
                                    </Button>
                                </div>
                            )}

                            {/* Text Input Area */}
                            <div className="relative rounded-[2rem] overflow-hidden bg-primary/5 border-2 border-primary/20 flex flex-col p-6 shadow-inner gap-4">
                                <div className="flex items-center gap-2 text-primary font-bold">
                                    <Type className="w-5 h-5" />
                                    <span>Describe your meal</span>
                                </div>
                                <Textarea 
                                    placeholder="e.g., A bowl of oatmeal with blueberries and a side of scrambled eggs..."
                                    className="w-full bg-background/50 border-primary/10 resize-none text-base p-4 rounded-xl min-h-[100px]"
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                />
                                <Button 
                                    onClick={handleTextSubmit} 
                                    className="w-full h-12 rounded-xl font-bold shadow-md"
                                    disabled={!textInput.trim() || isAnalyzing}
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Analyze Text
                                </Button>
                            </div>
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
                                        <h3 className="text-2xl font-black font-headline">{t('analyzing')}</h3>
                                        <p className="text-muted-foreground">{t('loadingDesc')}</p>
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
                                                <span className="text-xs font-black uppercase tracking-[0.2em]">{t('detectionFound')}</span>
                                            </div>
                                            <h3 className="text-2xl md:text-4xl font-black font-headline tracking-tight">
                                                {getLocalizedValue(result.dishName, locale)}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-primary/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-primary/10">
                                                <p className="text-[8px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest">{t('calories')}</p>
                                                <p className="text-xl md:text-2xl font-black font-headline">{result.calories}</p>
                                            </div>
                                            <div className="bg-emerald-500/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-emerald-500/10">
                                                <p className="text-[8px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest text-emerald-600">{t('protein')}</p>
                                                <p className="text-xl md:text-2xl font-black font-headline text-emerald-600">{result.macros.protein}g</p>
                                            </div>
                                            <div className="bg-blue-500/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-blue-500/10">
                                                <p className="text-[8px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest text-blue-600">{t('carbs')}</p>
                                                <p className="text-xl md:text-2xl font-black font-headline text-blue-600">{result.macros.carbs}g</p>
                                            </div>
                                            <div className="bg-orange-500/5 p-3 md:p-4 rounded-xl md:rounded-2xl border border-orange-500/10">
                                                <p className="text-[8px] md:text-[10px] font-black uppercase text-muted-foreground tracking-widest text-orange-600">{t('fats')}</p>
                                                <p className="text-xl md:text-2xl font-black font-headline text-orange-600">{result.macros.fats}g</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="p-4 md:p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Info className="w-4 h-4 text-primary" />
                                                    <span className="font-bold text-sm">{t('healthInsights')}</span>
                                                </div>
                                                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                                                    {getLocalizedValue(result.healthInsights, locale)}
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('detectedIngredients')}</span>
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
                                        <p className="max-w-[200px]">{t('placeholder')}</p>
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
