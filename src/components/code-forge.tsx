"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, MessageSquareQuote, Combine, Sparkles, Image } from 'lucide-react';

import Chat from '@/components/chat';
import HomeworkHelper from '@/components/homework-helper';
import Explain from '@/components/explain';
import Summarize from '@/components/summarize';
import Imagine from '@/components/imagine';

import type { Capability } from '@/lib/types';

const capabilities: { name: Capability; icon: React.ElementType }[] = [
  { name: 'Solve', icon: Sparkles },
  { name: 'Study', icon: Bookmark },
  { name: 'Explain', icon: MessageSquareQuote },
  { name: 'Summarize', icon: Combine },
  { name: 'Imagine', icon: Image },
];

export function CodeForge() {
  const [activeView, setActiveView] = useState<Capability>('Solve');
  const [initialData, setInitialData] = useState<any>(null);

  const switchView = (view: Capability, data: any) => {
    setActiveView(view);
    setInitialData(data);
  };

  const renderActiveComponent = () => {
    const props = { initialData, setInitialData };
    switch (activeView) {
      case 'Solve':
        return <Chat onSwitchView={switchView} />;
      case 'Study':
        return <HomeworkHelper {...props} />;
      case 'Explain':
        return <Explain {...props} />;
      case 'Summarize':
        return <Summarize {...props} />;
      case 'Imagine':
        return <Imagine {...props} />;
      default:
        return <Chat onSwitchView={switchView} />;
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-center gap-2 flex-wrap px-4">
        {capabilities.map(({ name, icon: Icon }) => (
          <Button
            key={name}
            variant={activeView === name ? 'default' : 'ghost'}
            size="sm"
            onClick={() => {
              setActiveView(name);
              setInitialData(null);
            }}
            className="capitalize rounded-full px-3 text-xs h-7"
          >
            <Icon className="w-3.5 h-3.5 mr-1.5" />
            {name}
          </Button>
        ))}
      </div>

      <div className="flex-grow">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
