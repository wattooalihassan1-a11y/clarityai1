"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Send, Settings, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useChatHistory } from '@/hooks/use-chat-history';
import { handleChatConversation, generatePicture } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      let imagePayload;
      if (imageToSend) {
        const contentType = imageToSend.match(/^data:(.*);base64,/)?.[1];
        if (contentType) {
          imagePayload = { url: imageToSend, contentType };
        } else {
            console.warn("Could not determine content type from data URI.");
        }
      }

      const result = await handleChatConversation({
        message: messageToSend,
        image: imagePayload,
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
    <Card className="flex flex-col h-[calc(100vh-14rem)] shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-primary"/>
            <CardTitle className="text-xl">Chat with AI</CardTitle>
          </div>
          <ChatSettings />
      </CardHeader>
      <CardContent className="flex-grow p-0 flex flex-col">
        <ScrollArea className="flex-grow" ref={scrollAreaRef}>
          <div className="p-4 space-y-6">
            {!isLoaded && <p className="text-center text-muted-foreground">Loading chat...</p>}
            {isLoaded && (!activeChat || activeChat.messages.length === 0) && (
              <div className="flex justify-start">
                  <div className="p-4 rounded-lg bg-muted max-w-md">
                    <p className="text-sm">Hello! How can I help you today?</p>
                  </div>
              </div>
            )}
            {activeChat?.messages.map((message, index) => (
              <div key={index} className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 rounded-lg max-w-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    {message.imageUrl && (
                      <div className="mb-2">
                        <Image src={message.imageUrl} alt="Uploaded content" width={300} height={300} className="rounded-md" />
                      </div>
                    )}
                    <MarkdownRenderer content={message.content} />
                  </div>
              </div>
            ))}
            {isSending && (
               <div className="flex items-end gap-2 justify-start">
                  <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-0"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>

      <div className="p-4 border-t">
        {image && (
          <div className="relative mb-2 w-fit">
            <Image src={image} alt="Preview" width={80} height={80} className="rounded-md" />
            <Button variant="ghost" size="icon" className="absolute -top-2 -right-2 w-6 h-6 bg-background rounded-full" onClick={() => setImage(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {isRecording ? (
          <VoiceInput onStopRecording={setIsRecording} onSubmit={handleVoiceSubmit} />
        ) : (
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="w-5 h-5 text-muted-foreground" /></Button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Clarity AI..."
              className="w-full resize-none rounded-full border bg-muted py-3 pl-12 pr-24"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
              }}
            />
            <div className="absolute flex items-center gap-1 right-2 top-1/2 -translate-y-1/2">
              <Button variant="ghost" size="icon" onClick={() => setIsRecording(true)}><Mic className="w-5 h-5 text-muted-foreground" /></Button>
              <Button onClick={handleSendMessage} disabled={isSending} size="icon" className="rounded-full w-9 h-9"><Send className="w-5 h-5" /></Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
