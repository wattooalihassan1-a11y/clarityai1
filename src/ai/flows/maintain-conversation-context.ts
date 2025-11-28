'use server';

/**
 * @fileOverview Handles the main chat logic, taking into account conversation history, persona,
 * language, and any attached images.  It uses tools to decide which capabilities to employ.
 *
 * - handleChatConversation - A function that handles the chat conversation.
 * - HandleChatConversationInput - The input type for the handleChatConversation function.
 * - HandleChatConversationOutput - The return type for the handleChatConversation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleChatConversationInputSchema = z.object({
  message: z.string().describe('The user message.'),
  chatHistory: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional().describe('The chat history.'),
  persona: z.string().optional().describe('The persona of the AI.'),
  language: z.string().optional().describe('The language to use.'),
  image: z.string().optional().describe(
    "An image to accompany the message, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
  ),
});
export type HandleChatConversationInput = z.infer<typeof HandleChatConversationInputSchema>;

const HandleChatConversationOutputSchema = z.object({
  response: z.string().describe('The AI response.'),
});
export type HandleChatConversationOutput = z.infer<typeof HandleChatConversationOutputSchema>;

export async function handleChatConversation(input: HandleChatConversationInput): Promise<HandleChatConversationOutput> {
  return handleChatConversationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleChatConversationPrompt',
  input: {schema: HandleChatConversationInputSchema},
  output: {schema: HandleChatConversationOutputSchema},
  prompt: `You are an AI assistant. Your persona is {{{persona}}}. You are communicating in {{{language}}}.

  {% if image %}
  The user has provided an image: {{media url=image}}.
  {% endif %}

  The user has sent the following message: {{{message}}}.

  {% if chatHistory %}
  Here is the chat history:
  {{#each chatHistory}}
  {{this.role}}: {{this.content}}
  {{/each}}
  {% endif %}

  Respond to the user's message, taking into account the chat history, persona, language, and any attached images.
`,
});

const handleChatConversationFlow = ai.defineFlow(
  {
    name: 'handleChatConversationFlow',
    inputSchema: HandleChatConversationInputSchema,
    outputSchema: HandleChatConversationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
