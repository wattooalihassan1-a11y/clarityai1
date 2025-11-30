export type NewMessage = {
    role: 'user' | 'assistant';
    content: string;
    imageUrl?: string | null;
  };
  
  export type Message = NewMessage & {
    id: string;
  };
  
  export type Chat = {
    id: string;
    title: string;
    createdAt: string;
    messages: Message[];
    persona: string;
    language: string;
  };
  
  export type Capability = 'Solve' | 'Tutor' | 'Explain' | 'Summarize' | 'Get Idea';
  
