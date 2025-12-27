import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="lg:ml-64 p-4 sm:p-6 pt-16 lg:pt-6 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
