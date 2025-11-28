"use client";

import { useState } from 'react';
import { Settings, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChatHistory } from '@/hooks/use-chat-history';
import { LANGUAGES, PERSONAS } from '@/lib/constants';
import { PrivacyPolicy } from './privacy-policy';
import { formatDistanceToNow } from 'date-fns';

export function ChatSettings() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    chats,
    activeChat,
    createChat,
    deleteChat,
    loadChat,
    updateChatSettings,
  } = useChatHistory();

  const handleSettingChange = (type: 'persona' | 'language', value: string) => {
    if (activeChat) {
      updateChatSettings(activeChat.id, { [type]: value });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon"><Settings className="w-5 h-5" /></Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        
        <div className="mt-4 space-y-4">
          <h3 className="text-sm font-medium">AI Settings</h3>
          <div className="space-y-2">
            <Select
              value={activeChat?.language}
              onValueChange={(value) => handleSettingChange('language', value)}
              disabled={!activeChat}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select
              value={activeChat?.persona}
              onValueChange={(value) => handleSettingChange('persona', value)}
              disabled={!activeChat}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Persona" />
              </SelectTrigger>
              <SelectContent>
                {PERSONAS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex-1 flex flex-col min-h-0">
          <h3 className="text-sm font-medium">Recent Chats</h3>
          <ScrollArea className="flex-1 mt-2 -mx-6">
            <div className="px-6 space-y-2">
              {chats.map(chat => (
                <div key={chat.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-accent">
                  <button className="flex-1 text-left" onClick={() => { loadChat(chat.id); setIsOpen(false); }}>
                    <p className="text-sm font-medium truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true })}
                    </p>
                  </button>
                  <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => deleteChat(chat.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        
        <SheetFooter className="mt-4">
          <div className="flex flex-col w-full gap-2">
            <Button onClick={() => { createChat(); setIsOpen(false); }}>
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            <PrivacyPolicy />
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
