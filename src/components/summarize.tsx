"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { summarizeText } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { SummarizeTextOutput } from '@/ai/flows/summarize-text';

interface SummarizeProps {
  initialData: { text: string } | null;
  setInitialData: (data: any) => void;
}

export default function Summarize({ initialData, setInitialData }: SummarizeProps) {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SummarizeTextOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await summarizeText({ text });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to summarize the text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData?.text) {
      setText(initialData.text);
      handleSubmit();
      setInitialData(null);
    }
  }, [initialData, setInitialData]);


  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the text you want to summarize here..."
          className="min-h-[200px]"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Summarizing...' : 'Summarize'}
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
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{result.summary}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
