"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { studyBuddy } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { StudyBuddyOutput } from '@/ai/flows/study-buddy';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';

interface StudyBuddyProps {
  initialData: { topic: string } | null;
  setInitialData: (data: any) => void;
}

type Flashcard = StudyBuddyOutput['flashcards'][0];

export default function StudyBuddy({ initialData, setInitialData }: StudyBuddyProps) {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(async (currentTopic: string) => {
    if (!currentTopic.trim()) return;

    setIsLoading(true);
    setFlashcards([]);
    setCurrentCardIndex(0);
    setIsFlipped(false);

    try {
      const res = await studyBuddy({ topic: currentTopic });
      if (res.flashcards && res.flashcards.length > 0) {
        setFlashcards(res.flashcards);
      } else {
        toast({
          title: "No flashcards generated",
          description: "The AI couldn't generate flashcards for this topic. Please try another one.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(topic);
  };
  
  useEffect(() => {
    if (initialData?.topic) {
      const initialTopic = initialData.topic;
      setTopic(initialTopic);
      handleSubmit(initialTopic);
      setInitialData(null); 
    }
  }, [initialData, setInitialData, handleSubmit]);

  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  };

  return (
    <div className="space-y-6 flex flex-col h-full">
      <form onSubmit={handleFormSubmit} className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to study?"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Create Flashcards'}
        </Button>
      </form>

      <div className="flex-1 flex flex-col items-center justify-center">
        {isLoading && (
          <div className="w-full max-w-md h-64 bg-muted rounded-lg flex items-center justify-center animate-pulse">
            <p className="text-muted-foreground">Generating flashcards...</p>
          </div>
        )}

        {!isLoading && flashcards.length === 0 && (
          <div className="text-center text-muted-foreground">
            <p>Enter a topic to start your study session.</p>
          </div>
        )}

        {flashcards.length > 0 && (
          <div className="w-full max-w-md space-y-4">
            <div 
              className="relative w-full h-64 cursor-pointer" 
              onClick={() => setIsFlipped(!isFlipped)}
              style={{ perspective: '1000px' }}
            >
              <Card 
                className="absolute w-full h-full flex items-center justify-center p-6 text-center transition-transform duration-500"
                style={{
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <p className="text-xl font-semibold">{flashcards[currentCardIndex].question}</p>
              </Card>
              <Card 
                className="absolute w-full h-full flex items-center justify-center p-6 text-center bg-accent transition-transform duration-500"
                style={{
                  transform: isFlipped ? 'rotateY(0deg)' : 'rotateY(-180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                <CardContent className="p-0">
                  <p>{flashcards[currentCardIndex].answer}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={handlePrevCard}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="text-sm text-muted-foreground">
                {currentCardIndex + 1} / {flashcards.length}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextCard}>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
