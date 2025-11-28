import { WandSparkles } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <header className="sticky top-0 z-10 flex items-center h-12 px-4 md:px-6 bg-background">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-primary/20 text-primary">
            <WandSparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-headline text-foreground">Clarity AI</h1>
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
