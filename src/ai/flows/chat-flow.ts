'use server';

/**
 * @fileOverview A chatbot flow for answering questions about meals, food, health, and recipes.
 *
 * - chat - A function that handles the chat interaction.
 */

import { chatModel } from '@/ai/gemini';
import {
  type ChatInput,
  type ChatOutput,
} from '@/ai/schemas';

export async function chat({ history, message }: ChatInput): Promise<ChatOutput> {
  try {
    // Map history to the format expected by the direct SDK
    const contents = history.map((msg: ChatMessage) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chatSession = chatModel.startChat({
      history: contents,
      systemInstruction: `You are DailyDine Plus Assistant, a professional and friendly wellness coach.
Your primary goal is to help users with:
1. Indian cuisine, healthy recipes, and personalized meal plans.
2. Lifestyle improvements (mindful living, hydration, routine building).
3. Physical wellness: Yoga, stretching, and activity levels.
4. Recovery: Sleep hygiene, circadian rhythm, and stress relief (Zen practices).
5. Using DailyDine Plus: Guide users on how to use the site's features like the Habit Tracker, Water Tracker, Zen Journal, and Vision Scanner.

STRICT POLICY:
- ONLY answer questions related to the topics above.
- If a user asks about unrelated topics (e.g., politics, celebrities, general news, gaming, etc.), politely decline and steer the conversation back to health and wellness.
- Keep responses encouraging, evidence-based, and concise.`,
    });

    const result = await chatSession.sendMessage(message);
    const response = await result.response;

    return {
      response: response.text(),
    };
  } catch (error) {
    console.error('Chat Error:', error);
    return {
      response: "I'm sorry, I encountered an error. Please try again.",
    };
  }
}
