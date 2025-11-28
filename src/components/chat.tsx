"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Paperclip, Mic, Send, Settings, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import { useChatHistory } from '@/hooks/use-chat-history';
import { handleChatConversation, generatePicture } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ChatSettings } from '@/components/chat-settings';
import { MarkdownRenderer } from './markdown-renderer';
import { VoiceInput } from './voice-input';
import type { Capability } from '@/lib/types';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ChatProps {
  onSwitchView: (view: Capability, data: any) => void;
}

export default function Chat({ onSwitchView }: ChatProps) {
  const { toast } = useToast();
  const { activeChat, addMessage, isLoaded } = useChatHistory();
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processSlashCommand = (command: string, args: string) => {
    switch (command) {
      case '/study':
        onSwitchView('Study', { question: args });
        return true;
      case '/explain':
        onSwitchView('Explain', { topic: args });
        return true;
      case '/summarize':
        onSwitchView('Summarize', { text: args });
        return true;
      case '/idea':
        onSwitchView('Get Idea', { topic: args });
        return true;
      case '/imagine':
        handleImageGeneration(args);
        return true;
      default:
        return false;
    }
  };

  const handleImageGeneration = async (prompt: string) => {
    if (!activeChat || !prompt) return;
    setIsSending(true);
    addMessage(activeChat.id, { role: 'user', content: `/imagine ${prompt}` });
    try {
      addMessage(activeChat.id, { role: 'assistant', content: 'Generating image...' });
      const result = await generatePicture({ prompt });
      addMessage(activeChat.id, { role: 'assistant', content: `Here is your generated image for: "${prompt}"`, imageUrl: result.imageUrl });
    } catch (error) {
      console.error(error);
      toast({ title: "Image Generation Failed", description: "Could not generate the image.", variant: "destructive" });
      addMessage(activeChat.id, { role: 'assistant', content: 'Sorry, I failed to generate the image.' });
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() && !image) return;
    if (!activeChat) {
      toast({ title: "No active chat", description: "Please select or create a new chat.", variant: "destructive" });
      return;
    }

    setIsSending(true);
    const messageToSend = input;
    const imageToSend = image;
    
    setInput('');
    setImage(null);

    const [command, ...argsParts] = messageToSend.split(' ');
    const args = argsParts.join(' ');

    if (command.startsWith('/') && processSlashCommand(command, args)) {
      setIsSending(false);
      return;
    }

    addMessage(activeChat.id, { role: 'user', content: messageToSend, imageUrl: imageToSend });

    try {
      const result = await handleChatConversation({
        message: messageToSend,
        image: imageToSend || undefined,
        chatHistory: activeChat.messages,
        persona: activeChat.persona,
        language: activeChat.language,
      });
      addMessage(activeChat.id, { role: 'assistant', content: result.response });
    } catch (error) {
      console.error(error);
      toast({ title: "An error occurred", description: "Failed to get a response from the AI.", variant: "destructive" });
      addMessage(activeChat.id, { role: 'assistant', content: 'Sorry, something went wrong.' });
    } finally {
      setIsSending(false);
    }
  };
  
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceSubmit = (transcript: string) => {
    setInput(prev => prev ? `${prev} ${transcript}` : transcript);
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-14rem)]">
      <div className="flex-grow">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {!isLoaded && <p className="text-center text-muted-foreground">Loading chat...</p>}
            {isLoaded && (!activeChat || activeChat.messages.length === 0) && (
              <div className="text-center text-muted-foreground">
                <p>Start a conversation with Clarity AI.</p>
                <p className="text-sm">Use slash commands like /study, /explain, /summarize, /idea, or /imagine.</p>
              </div>
            )}
            {activeChat?.messages.map((message, index) => (
              <div key={index} className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {message.role === 'assistant' && <Avatar className="w-8 h-8"><AvatarFallback>AI</AvatarFallback></Avatar>}
                <Card className={`max-w-xl ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  <CardContent className="p-3">
                    {message.imageUrl && (
                      <div className="mb-2">
                        <Image src={message.imageUrl} alt="Uploaded content" width={300} height={300} className="rounded-md" />
                      </div>
                    )}
                    <MarkdownRenderer content={message.content} />
                  </CardContent>
                </Card>
                {message.role === 'user' && <Avatar className="w-8 h-8"><AvatarFallback>U</AvatarFallback></Avatar>}
              </div>
            ))}
            {isSending && (
               <div className="flex items-end gap-2 justify-start">
                  <Avatar className="w-8 h-8"><AvatarFallback>AI</AvatarFallback></Avatar>
                  <Card className="max-w-xl bg-muted">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-0"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                        <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t">
        {image && (
          <div className="relative mb-2 w-fit">
            <Image src={image} alt="Preview" width={80} height={80} className="rounded-md" />
            <Button variant="ghost" size="icon" className="absolute top-0 right-0 w-6 h-6 bg-background/50" onClick={() => setImage(null)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {isRecording ? (
          <VoiceInput onStopRecording={setIsRecording} onSubmit={handleVoiceSubmit} />
        ) : (
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or use / to see commands..."
              className="pr-32 resize-none"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <div className="absolute flex items-center gap-1 bottom-2 right-2">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" onClick={() => setIsRecording(true)}><Mic className="w-5 h-5" /></Button>
              <Button onClick={handleSendMessage} disabled={isSending}><Send className="w-5 h-5" /></Button>
              <ChatSettings />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
