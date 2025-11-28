import { Sparkles } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary">
            <Sparkles className="w-6 h-6" />
          </div>
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
