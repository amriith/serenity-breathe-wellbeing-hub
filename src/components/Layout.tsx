
import React from 'react';
import Navigation from './Navigation';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  activePage: 'home' | 'breathing' | 'music' | 'tips' | 'progress';
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle, activePage }) => {
  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </header>
        <main className="mb-8">
          {children}
        </main>
      </div>
      <Navigation activePage={activePage} />
    </div>
  );
};

export default Layout;
