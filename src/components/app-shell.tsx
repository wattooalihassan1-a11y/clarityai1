import { BrainCircuit } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm shrink-0 md:px-6">
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-primary-foreground" />
          <div>
            <h1 className="text-xl font-bold font-headline text-foreground">Clarity AI</h1>
            <p className="text-xs text-muted-foreground">by NextGenDeveloper Ali Hassan</p>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
