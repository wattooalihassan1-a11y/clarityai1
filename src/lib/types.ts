export type Message = {
    role: 'user' | 'assistant';
    content: string;
    imageUrl?: string | null;
  };
  
  export type Chat = {
    id: string;
    title: string;
    createdAt: string;
    messages: Message[];
    persona: string;
    language: string;
  };
  
  export type Capability = 'Solve' | 'Study' | 'Explain' | 'Summarize' | 'Get Idea';
  