"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getIdea } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { GetIdeaOutput } from '@/ai/flows/get-idea';

interface GetIdeaProps {
  initialData: { topic: string } | null;
  setInitialData: (data: any) => void;
}

export default function GetIdea({ initialData, setInitialData }: GetIdeaProps) {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<GetIdeaOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await getIdea({ topic });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to brainstorm ideas. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData?.topic) {
      setTopic(initialData.topic);
      handleSubmit();
      setInitialData(null);
    }
  }, [initialData, setInitialData]);


  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What topic do you want ideas for?"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Brainstorming...' : 'Get Ideas'}
        </Button>
      </form>

      {isLoading && (
        <Card className="animate-pulse">
            <CardHeader><div className="h-6 w-1/3 bg-muted rounded"></div></CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-5/6 bg-muted rounded"></div>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Ideas for: {topic}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {result.ideas.map((idea, index) => (
                <li key={index} className="text-muted-foreground">{idea}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
