"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generatePicture } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import NextImage from 'next/image';
import type { GeneratePictureOutput } from '@/ai/flows/generate-picture';

interface ImagineProps {
  initialData: { prompt: string } | null;
  setInitialData: (data: any) => void;
}

export default function Imagine({ initialData, setInitialData }: ImagineProps) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<GeneratePictureOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await generatePicture({ prompt });
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData?.prompt) {
      setPrompt(initialData.prompt);
      handleSubmit();
      setInitialData(null);
    }
  }, [initialData, setInitialData]);


  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What do you want to imagine?"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Imagining...' : 'Imagine'}
        </Button>
      </form>

      {isLoading && (
        <Card className="animate-pulse">
            <CardHeader><div className="h-6 w-1/3 bg-muted rounded"></div></CardHeader>
            <CardContent className="space-y-4">
                <div className="aspect-square w-full bg-muted rounded-md"></div>
            </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Voilà!</CardTitle>
          </CardHeader>
          <CardContent>
            <NextImage 
                src={result.imageUrl} 
                alt={prompt} 
                width={512} 
                height={512} 
                className="rounded-md mx-auto"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
