"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareQuote, Combine, Sparkles, Image, Lightbulb } from 'lucide-react';

import Chat from '@/components/chat';
import HomeworkHelper from '@/components/homework-helper';
import Explain from '@/components/explain';
import Summarize from '@/components/summarize';
import GetIdea from '@/components/get-idea';

import type { Capability } from '@/lib/types';

const capabilities: { name: Capability; icon: React.ElementType }[] = [
  { name: 'Solve', icon: Sparkles },
  { name: 'Study', icon: MessageSquareQuote },
  { name: 'Explain', icon: MessageSquareQuote },
  { name: 'Summarize', icon: Combine },
  { name: 'Get Idea', icon: Lightbulb },
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
      case 'Get Idea':
        return <GetIdea {...props} />;
      default:
        return <Chat onSwitchView={switchView} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 flex-wrap p-4">
        {capabilities.map(({ name, icon: Icon }) => (
          <Button
            key={name}
            variant={activeView === name ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setActiveView(name);
              setInitialData(null);
            }}
            className="capitalize rounded-md p-2 text-xs h-auto transition-all duration-300 ease-in-out shadow-sm hover:shadow-md flex-col"
          >
            <Icon className="w-5 h-5 mb-1" />
            {name}
          </Button>
        ))}
      </div>

      <div className="flex-grow min-h-0">
        {renderActiveComponent()}
      </div>
    </div>
  );
}
