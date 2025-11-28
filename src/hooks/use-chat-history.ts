"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Chat, Message } from '@/lib/types';
import { DEFAULT_LANGUAGE, DEFAULT_PERSONA } from '@/lib/constants';
import { useToast } from './use-toast';

const CHAT_HISTORY_KEY = 'clarity-ai-chat-history';

export function useChatHistory() {
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const createNewChat = (title = "New Chat"): Chat => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      messages: [],
      persona: DEFAULT_PERSONA,
      language: DEFAULT_LANGUAGE,
    };
    return newChat;
  };

  useEffect(() => {
    // Start with a new chat every time
    const newChat = createNewChat();
    setChats([newChat]);
    setActiveChatId(newChat.id);
    setIsLoaded(true);
  }, []);

  const createChat = useCallback(() => {
    const newChat = createNewChat();
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const newChats = prev.filter(chat => chat.id !== chatId);
      if (activeChatId === chatId) {
        if (newChats.length > 0) {
          setActiveChatId(newChats[0].id);
        } else {
          const newChat = createNewChat();
          setActiveChatId(newChat.id);
          return [newChat];
        }
      }
      return newChats;
    });
  }, [activeChatId]);

  const loadChat = useCallback((chatId: string) => {
    const chatExists = chats.some(chat => chat.id === chatId);
    if (chatExists) {
      setActiveChatId(chatId);
    } else {
      console.error(`Chat with id ${chatId} not found.`);
      toast({
        title: "Error",
        description: "Could not find the selected chat.",
        variant: "destructive",
      });
    }
  }, [chats, toast]);

  const addMessage = useCallback((chatId: string, message: Message) => {
    setChats(prev => {
      const chatIndex = prev.findIndex(chat => chat.id === chatId);
      if (chatIndex === -1) return prev;

      const updatedChat = { ...prev[chatIndex] };
      updatedChat.messages = [...updatedChat.messages, message];

      // Set chat title from first user message
      if (updatedChat.messages.length === 1 && message.role === 'user') {
        updatedChat.title = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
      }

      const newChats = [...prev];
      newChats[chatIndex] = updatedChat;
      
      // Move updated chat to the top
      const [movedChat] = newChats.splice(chatIndex, 1);
      newChats.unshift(movedChat);

      return newChats;
    });
  }, []);

  const updateChatSettings = useCallback((chatId: string, settings: { persona?: string, language?: string }) => {
    setChats(prev => prev.map(chat =>
      chat.id === chatId ? { ...chat, ...settings } : chat
    ));
  }, []);
  
  const activeChat = chats.find(chat => chat.id === activeChatId) || null;

  return {
    chats,
    activeChat,
    activeChatId,
    isLoaded,
    createChat,
    deleteChat,
    loadChat,
    addMessage,
    updateChatSettings,
  };
}
