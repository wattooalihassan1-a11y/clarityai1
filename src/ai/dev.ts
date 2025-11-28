import { config } from 'dotenv';
config();

import '@/ai/flows/get-idea.ts';
import '@/ai/flows/homework-helper.ts';
import '@/ai/flows/maintain-conversation-context.ts';
import '@/ai/flows/summarize-text.ts';
import '@/ai/flows/generate-picture.ts';
import '@/ai/flows/explain-topic.ts';