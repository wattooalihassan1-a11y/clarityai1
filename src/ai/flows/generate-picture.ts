/**
 * @fileOverview A flow to generate images based on a text prompt.
 *
 * - generatePicture - A function that handles the image generation process.
 * - GeneratePictureInput - The input type for the generatePicture function.
 * - GeneratePictureOutput - The return type for the generatePicture function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GeneratePictureInputSchema = z.object({
  prompt: z.string().describe('The prompt to use for image generation.'),
});

export type GeneratePictureInput = z.infer<typeof GeneratePictureInputSchema>;

const GeneratePictureOutputSchema = z.object({
  imageUrl: z.string().describe('The URL of the generated image.'),
});

export type GeneratePictureOutput = z.infer<typeof GeneratePictureOutputSchema>;

export async function generatePicture(input: GeneratePictureInput): Promise<GeneratePictureOutput> {
  return generatePictureFlow(input);
}

const generatePictureFlow = ai.defineFlow(
  {
    name: 'generatePictureFlow',
    inputSchema: GeneratePictureInputSchema,
    outputSchema: GeneratePictureOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: input.prompt,
    });

    if (!media) {
      throw new Error('No image was generated.');
    }

    return {
      imageUrl: media.url,
    };
  }
);
