"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { explainTopic } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { ExplainTopicOutput } from '@/ai/flows/explain-topic';

interface ExplainProps {
  initialData: { topic: string } | null;
  setInitialData: (data: any) => void;
}

export default function Explain({ initialData, setInitialData }: ExplainProps) {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState<ExplainTopicOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await explainTopic({ topic });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get an explanation. Please try again.",
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
          placeholder="What topic do you want explained?"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Explaining...' : 'Explain'}
        </Button>
      </form>

      {isLoading && (
        <Card className="animate-pulse">
            <CardHeader><div className="h-6 w-1/3 bg-muted rounded"></div></CardHeader>
            <CardContent className="space-y-4">
                <div className="h-4 w-full bg-muted rounded"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-full bg-muted rounded"></div>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Explanation for: {topic}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Explanation</h3>
              <p className="text-muted-foreground">{result.explanation}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Examples</h3>
              <p className="text-muted-foreground whitespace-pre-line">{result.examples}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Analogy</h3>
              <div className="p-4 bg-accent rounded-md">
                <p>{result.analogy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
