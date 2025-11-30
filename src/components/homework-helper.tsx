"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { homeworkHelper } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { HomeworkHelperOutput } from '@/ai/flows/homework-helper';

interface HomeworkHelperProps {
  initialData: { question: string } | null;
  setInitialData: (data: any) => void;
}

export default function HomeworkHelper({ initialData, setInitialData }: HomeworkHelperProps) {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<HomeworkHelperOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(async (currentQuestion: string) => {
    if (!currentQuestion.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const res = await homeworkHelper(currentQuestion);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to get help with your homework. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (initialData?.question) {
      const initialQuestion = initialData.question;
      setQuestion(initialQuestion);
      handleSubmit(initialQuestion);
      setInitialData(null); // Consume the initial data
    }
  }, [initialData, setInitialData, handleSubmit]);


  return (
    <div className="space-y-6">
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(question); }} className="flex gap-2">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your homework question..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Solve'}
        </Button>
      </form>

      {isLoading && (
         <div className="space-y-4">
            <div className="w-full h-12 bg-muted rounded-md animate-pulse"></div>
            <div className="w-full h-12 bg-muted rounded-md animate-pulse delay-150"></div>
            <div className="w-full h-12 bg-muted rounded-md animate-pulse delay-300"></div>
         </div>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Solution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Step-by-step Solution:</h3>
              <Accordion type="single" collapsible className="w-full">
                {result.steps.map((step, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>Step {index + 1}</AccordionTrigger>
                    <AccordionContent>{step}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Final Answer:</h3>
              <div className="p-4 bg-accent rounded-md">
                <p>{result.answer}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
