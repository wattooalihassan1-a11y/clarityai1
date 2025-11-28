'use server';
/**
 * @fileOverview A homework problem solver AI agent.
 *
 * - homeworkHelper - A function that handles the homework solving process.
 * - HomeworkHelperInput - The input type for the homeworkHelper function.
 * - HomeworkHelperOutput - The return type for the homeworkHelper function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HomeworkHelperInputSchema = z.string().describe('The homework question to be solved.');
export type HomeworkHelperInput = z.infer<typeof HomeworkHelperInputSchema>;

const HomeworkHelperOutputSchema = z.object({
  steps: z.array(z.string()).describe('The step-by-step solution to the homework question.'),
  answer: z.string().describe('The final answer to the homework question.'),
});
export type HomeworkHelperOutput = z.infer<typeof HomeworkHelperOutputSchema>;

export async function homeworkHelper(input: HomeworkHelperInput): Promise<HomeworkHelperOutput> {
  return homeworkHelperFlow(input);
}

const prompt = ai.definePrompt({
  name: 'homeworkHelperPrompt',
  input: {schema: HomeworkHelperInputSchema},
  output: {schema: HomeworkHelperOutputSchema},
  prompt: `You are an expert tutor that provides step-by-step solutions to homework questions.

  Provide a detailed, step-by-step solution to the following question. Be sure to show all steps clearly.
  At the end, clearly indicate the final answer.

  Question: {{{$input}}}`,
});

const homeworkHelperFlow = ai.defineFlow(
  {
    name: 'homeworkHelperFlow',
    inputSchema: HomeworkHelperInputSchema,
    outputSchema: HomeworkHelperOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
