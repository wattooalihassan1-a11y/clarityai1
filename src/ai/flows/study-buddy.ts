'use server';
/**
 * @fileOverview A flow that generates flashcards for a given topic.
 *
 * - studyBuddy - A function that takes a topic and returns a list of flashcards.
 * - StudyBuddyInput - The input type for the studyBuddy function.
 * - StudyBuddyOutput - The return type for the studyBuddy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyBuddyInputSchema = z.object({
  topic: z.string().describe('The topic to generate flashcards for.'),
});
export type StudyBuddyInput = z.infer<typeof StudyBuddyInputSchema>;

const FlashcardSchema = z.object({
  question: z.string().describe('The question for the flashcard.'),
  answer: z.string().describe('The answer to the flashcard question.'),
});

const StudyBuddyOutputSchema = z.object({
  flashcards: z
    .array(FlashcardSchema)
    .describe('A list of flashcards with questions and answers.'),
});
export type StudyBuddyOutput = z.infer<typeof StudyBuddyOutputSchema>;

export async function studyBuddy(input: StudyBuddyInput): Promise<StudyBuddyOutput> {
  return studyBuddyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studyBuddyPrompt',
  input: {schema: StudyBuddyInputSchema},
  output: {schema: StudyBuddyOutputSchema},
  prompt: `You are a helpful study assistant. Your goal is to create a list of flashcards for the given topic. 
  
  Each flashcard should have a concise question and a clear, accurate answer. Generate 5 to 10 flashcards.

  Topic: {{{topic}}}
  `,
});

const studyBuddyFlow = ai.defineFlow(
  {
    name: 'studyBuddyFlow',
    inputSchema: StudyBuddyInputSchema,
    outputSchema: StudyBuddyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
