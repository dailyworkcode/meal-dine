'use client';

import * as React from 'react';
import {
  Bot,
  CircleUser,
  Droplets,
  Loader2,
  MessageSquare,
  Moon,
  Send,
  Utensils,
  X,
  Zap,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { chat } from '@/ai/flows/chat-flow';
import type { ChatMessage } from '@/ai/schemas';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useTranslations } from 'next-intl';

export function ChatBot() {
  const t = useTranslations('ChatBot');
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      role: 'model',
      content: t('greeting'),
    },
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const quickActions = [
    { label: t('actionYoga'), icon: <Zap className="h-4 w-4" />, query: "Suggest a 15-minute morning yoga flow" },
    { label: t('actionHydration'), icon: <Droplets className="h-4 w-4" />, query: "How much water should I drink daily?" },
    { label: t('actionMeal'), icon: <Utensils className="h-4 w-4" />, query: "Give me a healthy Indian breakfast idea" },
    { label: t('actionSleep'), icon: <Moon className="h-4 w-4" />, query: "How can I improve my sleep quality?" },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleToggle = () => setIsOpen(prev => !prev);

  const handleSubmit = async (e?: React.FormEvent, customInput?: string) => {
    e?.preventDefault();
    const messageToSend = customInput || input;
    if (!messageToSend.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chat({
        message: messageToSend,
        history: messages,
      });

      const botMessage: ChatMessage = {
        role: 'model',
        content: response.response,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      toast({
        variant: 'destructive',
        title: t('errorTitle'),
        description: t('errorDescription'),
      });
      // remove the user message if the bot fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out',
          isOpen && 'pointer-events-none opacity-0'
        )}
      >
        <Button
          size="lg"
          className="h-16 w-16 rounded-full shadow-lg"
          onClick={handleToggle}
        >
          <MessageSquare className="h-8 w-8" />
          <span className="sr-only">{t('openChat')}</span>
        </Button>
      </div>

      <div
        className={cn(
          'fixed bottom-4 right-4 z-[100] w-full max-w-sm transition-all duration-500 ease-in-out sm:bottom-8 sm:right-8',
          !isOpen
            ? 'translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        )}
      >
        <Card className="flex h-[70vh] max-h-[80vh] flex-col shadow-2xl border-none glass-premium rounded-[2rem] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-primary/10 bg-primary/5 p-6">
            <CardTitle className="flex items-center gap-3 font-black font-headline tracking-tight text-primary">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Bot className="h-6 w-6" />
              </div>
              {t('title')}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={handleToggle} className="rounded-full hover:bg-black/5">
              <X className="h-5 w-5" />
              <span className="sr-only">{t('closeChat')}</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-hide">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : ''
                )}
              >
                {message.role === 'model' && (
                  <Avatar className="h-10 w-10 border-2 border-primary/20 bg-background">
                    <AvatarFallback className="bg-primary/5">
                      <Bot className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-sm font-medium leading-relaxed shadow-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-white/50 backdrop-blur-md border border-primary/5 text-foreground rounded-tl-none'
                  )}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <Avatar className="h-10 w-10 border-2 border-primary/20 bg-primary/10">
                    <AvatarFallback className="bg-transparent">
                      <CircleUser className="h-6 w-6 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10 border-2 border-primary/20 bg-background">
                  <AvatarFallback className="bg-primary/5">
                    <Bot className="h-6 w-6 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white/50 backdrop-blur-md border border-primary/5 rounded-[1.5rem] rounded-tl-none px-5 py-3.5">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
            {!isLoading && messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 pt-4">
                {quickActions.map((action, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    className="h-auto py-3 px-4 justify-start text-left text-xs font-bold gap-2 rounded-2xl border-primary/10 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                    onClick={() => handleSubmit(undefined, action.query)}
                  >
                    <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                      {action.icon}
                    </div>
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="border-t border-primary/10 p-4 bg-background/50">
            <form onSubmit={handleSubmit} className="flex w-full gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-primary/10">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={t('inputPlaceholder')}
                disabled={isLoading}
                className="border-none bg-transparent focus-visible:ring-0 text-sm font-medium px-4"
              />
              <Button type="submit" size="icon" disabled={isLoading} className="rounded-xl h-10 w-10 shrink-0 shadow-lg">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
