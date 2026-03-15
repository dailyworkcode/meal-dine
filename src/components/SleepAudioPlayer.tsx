'use client';

import * as React from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Moon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { motion, AnimatePresence } from 'framer-motion';

const AUDIO_TRACKS = [
    {
        title: "Deep Sleep Ambient",
        description: "Gentle rain to help synchronize your brainwaves.",
        url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_924a6cd250.mp3?filename=rain-and-thunder-16705.mp3"
    },
    {
        title: "Tranquil Ocean",
        description: "Calm ocean waves washing over a peaceful shore.",
        url: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_d0cf1f516d.mp3?filename=ocean-waves-112906.mp3"
    },
    {
        title: "Forest Ambience",
        description: "Soothing sounds of nature deep within a tranquil forest.",
        url: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_d4c94cdbe3.mp3?filename=forest-with-small-river-birds-and-nature-field-recording-6735.mp3"
    }
];

export function SleepAudioPlayer() {
    const audioRef = React.useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [volume, setVolume] = React.useState(0.5);
    const [isMuted, setIsMuted] = React.useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = React.useState(0);

    const currentTrack = AUDIO_TRACKS[currentTrackIndex];

    React.useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio(currentTrack.url);
            audioRef.current.loop = true;
        } else {
            // When track changes, update source and play if it was playing
            const wasPlaying = isPlaying;
            audioRef.current.pause();
            audioRef.current.src = currentTrack.url;
            if (wasPlaying) {
                audioRef.current.play().catch(e => console.error("Audio playback failed", e));
            }
        }

        audioRef.current.volume = isMuted ? 0 : volume;

        // Cleanup on unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [currentTrackIndex]); // Only re-run when track changes

    React.useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Audio playback failed", e));
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => setIsMuted(!isMuted);

    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % AUDIO_TRACKS.length);
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + AUDIO_TRACKS.length) % AUDIO_TRACKS.length);
    };

    return (
        <Card className="glass-premium border-none rounded-[2.5rem] overflow-hidden shadow-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] text-white relative">
            <CardContent className="p-8 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Animated Icon Area */}
                    <div className="relative">
                        <motion.div 
                            className="absolute inset-0 bg-blue-500/20 rounded-full blur-[30px]"
                            animate={{ 
                                scale: isPlaying ? [1, 1.5, 1] : 1,
                                opacity: isPlaying ? [0.3, 0.6, 0.3] : 0.3
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="relative w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center backdrop-blur-md">
                            {isPlaying ? (
                                <Music className="w-10 h-10 text-blue-300 animate-pulse" />
                            ) : (
                                <Moon className="w-10 h-10 text-blue-300/50" />
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-6 w-full text-center md:text-left">
                        <div className="space-y-1 relative min-h-[60px] flex items-center justify-center md:justify-start">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentTrackIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute inset-0 flex flex-col justify-center"
                                >
                                    <h3 className="text-2xl font-black font-headline text-white">{currentTrack.title}</h3>
                                    <p className="text-sm text-blue-200/60 font-medium">{currentTrack.description}</p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <div className="flex items-center gap-4">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={prevTrack}
                                    className="w-10 h-10 rounded-full hover:bg-white/10 text-blue-300 hover:text-white"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </Button>
                                
                                <Button 
                                    onClick={togglePlay}
                                    className="w-16 h-16 rounded-full bg-blue-500 hover:bg-blue-600 border-none shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-transform active:scale-95 flex items-center justify-center"
                                >
                                    {isPlaying ? (
                                        <Pause className="w-8 h-8 text-white fill-white" />
                                    ) : (
                                        <Play className="w-8 h-8 text-white fill-white ml-2" />
                                    )}
                                </Button>

                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={nextTrack}
                                    className="w-10 h-10 rounded-full hover:bg-white/10 text-blue-300 hover:text-white"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="flex-1 w-full max-w-[200px] flex items-center gap-4 bg-white/5 rounded-full px-4 py-3 border border-white/10 mx-auto md:mx-0">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="w-8 h-8 hover:bg-white/10 rounded-full shrink-0"
                                    onClick={toggleMute}
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX className="w-4 h-4 text-blue-300" />
                                    ) : (
                                        <Volume2 className="w-4 h-4 text-blue-300" />
                                    )}
                                </Button>
                                <Slider
                                    value={[isMuted ? 0 : volume]}
                                    max={1}
                                    step={0.01}
                                    onValueChange={(val) => {
                                        setVolume(val[0]);
                                        if (val[0] > 0) setIsMuted(false);
                                    }}
                                    className="[&_[role=slider]]:bg-blue-300 [&_[role=slider]]:border-blue-300 [&_.relative]:bg-blue-900/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            
            {/* Background subtle animated waves */}
            {isPlaying && (
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                     <motion.div 
                        className="absolute -inset-[100%] border-[1px] border-blue-400 rounded-full"
                        animate={{ scale: [0.5, 2], opacity: [0.8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                     />
                     <motion.div 
                        className="absolute -inset-[100%] border-[1px] border-blue-400 rounded-full"
                        animate={{ scale: [0.5, 2], opacity: [0.8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 2 }}
                     />
                </div>
            )}
        </Card>
    );
}
