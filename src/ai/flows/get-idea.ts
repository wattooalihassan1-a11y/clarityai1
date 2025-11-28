'use server';
/**
 * @fileOverview A flow that generates creative ideas related to a given topic.
 *
 * - getIdea - A function that takes a topic as input and returns a list of creative ideas.
 * - GetIdeaInput - The input type for the getIdea function.
 * - GetIdeaOutput - The return type for the getIdea function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetIdeaInputSchema = z.object({
  topic: z.string().describe('The topic to generate ideas for.'),
});
export type GetIdeaInput = z.infer<typeof GetIdeaInputSchema>;

const GetIdeaOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of creative ideas related to the topic.'),
});
export type GetIdeaOutput = z.infer<typeof GetIdeaOutputSchema>;

export async function getIdea(input: GetIdeaInput): Promise<GetIdeaOutput> {
  return getIdeaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getIdeaPrompt',
  input: {schema: GetIdeaInputSchema},
  output: {schema: GetIdeaOutputSchema},
  prompt: `You are a creative brainstorming assistant. Generate a list of creative ideas related to the following topic:\n\nTopic: {{{topic}}}\n\nIdeas:`,
});

const getIdeaFlow = ai.defineFlow(
  {
    name: 'getIdeaFlow',
    inputSchema: GetIdeaInputSchema,
    outputSchema: GetIdeaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
