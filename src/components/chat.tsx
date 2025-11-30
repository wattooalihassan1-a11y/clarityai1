"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Send, X, Settings, Sparkles, Pencil, Copy } from 'lucide-react';
import Image from 'next/image';
import { useChatHistory } from '@/hooks/use-chat-history';
import { handleChatConversation, generatePicture } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChatSettings } from '@/components/chat-settings';
import { MarkdownRenderer } from './markdown-renderer';
import { VoiceInput } from './voice-input';
import type { Capability, Message } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface ChatProps {
  onSwitchView: (view: Capability, data: any) => void;
}

export default function Chat({ onSwitchView }: ChatProps) {
  const { toast } = useToast();
  const { activeChat, addMessage, isLoaded, editMessage } = useChatHistory();
  const [input, setInput] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [activeChat?.messages]);

  useEffect(() => {
    if (editingMessage) {
      setEditedContent(editingMessage.content);
    }
  }, [editingMessage]);
  
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
      case '/q-gen':
        onSwitchView('Q-Gen', { topic: args });
        return true;
      case '/explain':
        onSwitchView('Explain', { topic: args });
        return true;
      case '/summarize':
        onSwitchView('Summarize', { text: args });
        return true;
      case '/imagine':
        handleImageGeneration(args);
        return true;
      case '/idea':
        onSwitchView('Get Idea', { topic: args });
        return true;
      default:
        return false;
    }
  };

  const handleImageGeneration = async (prompt: string) => {
    if (!activeChat || !prompt) return;
    setIsSending(true);
    addMessage({ role: 'user', content: `/imagine ${prompt}` });
    try {
      addMessage({ role: 'assistant', content: 'Generating image...' });
      const result = await generatePicture({ prompt });
      addMessage({ role: 'assistant', content: `Here is your generated image for: "${prompt}"`, imageUrl: result.imageUrl });
    } catch (error) {
      console.error(error);
      toast({ title: "Image Generation Failed", description: "Could not generate the image.", variant: "destructive" });
      addMessage({ role: 'assistant', content: 'Sorry, I failed to generate the image.' });
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
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
    }

    const [command, ...argsParts] = messageToSend.split(' ');
    const args = argsParts.join(' ');

    if (command.startsWith('/') && processSlashCommand(command, args)) {
      setIsSending(false);
      return;
    }

    let imagePayload;
    if (imageToSend) {
      const contentType = imageToSend.match(/^data:(.*);base64,/)?.[1];
      if (contentType) {
          imagePayload = { url: imageToSend, contentType };
      } else {
          console.warn("Could not determine content type from data URI.");
          imagePayload = { url: imageToSend, contentType: 'image/png' };
      }
    }
    addMessage({ role: 'user', content: messageToSend, imageUrl: imageToSend });

    try {
      const result = await handleChatConversation({
        message: messageToSend,
        image: imagePayload,
        chatHistory: activeChat.messages,
        persona: activeChat.persona,
        language: activeChat.language,
      });
      addMessage({ role: 'assistant', content: result.response });
    } catch (error) {
      console.error(error);
      toast({ title: "An error occurred", description: "Failed to get a response from the AI.", variant: "destructive" });
      addMessage({ role: 'assistant', content: 'Sorry, something went wrong.' });
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

  const handleSaveEdit = () => {
    if (editingMessage && activeChat) {
      editMessage(activeChat.id, editingMessage.id, editedContent);
      setEditingMessage(null);
      setEditedContent('');
    }
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to clipboard!" });
  };


  return (
    <div className="flex flex-col h-full bg-card rounded-2xl overflow-hidden">
      <header className="flex items-center justify-between p-3 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-primary/10 rounded-full">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-semibold font-headline">Chat with AI</h2>
          </div>
          <ChatSettings />
      </header>
      <div className="flex-1 flex flex-col">
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {isLoaded && (!activeChat || activeChat.messages.length === 0) && (
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-muted max-w-md">
                <p className="text-sm">Hello! How can I help you today?</p>
              </div>
            </div>
          )}
          {activeChat?.messages.map((message) => (
            <div key={message.id} className={`group flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'user' ? (
                <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setEditingMessage(message)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(message.content)}>
                  <Copy className="w-4 h-4" />
                </Button>
              )}
              <div className={`p-3 rounded-lg max-w-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
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
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-0"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-150"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse delay-300"></div>
                  </div>
                </div>
              </div>
          )}
        </div>

        <div className="p-3 border-t bg-background shrink-0">
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
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message Clarity AI..."
                className="w-full resize-none rounded-2xl border bg-muted py-3 pl-4 pr-32"
                rows={1}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
                }}
              />
              <div className="absolute flex items-center gap-1 right-2 top-1/2 -translate-y-1/2">
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => fileInputRef.current?.click()}><Paperclip className="w-5 h-5 text-muted-foreground" /></Button>
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsRecording(true)}><Mic className="w-5 h-5 text-muted-foreground" /></Button>
                <Button onClick={handleSendMessage} disabled={isSending} size="icon" className="rounded-full w-9 h-9 bg-primary text-primary-foreground hover:bg-primary/90"><Send className="w-5 h-5" /></Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Dialog open={!!editingMessage} onOpenChange={(isOpen) => !isOpen && setEditingMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[150px]"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditingMessage(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
