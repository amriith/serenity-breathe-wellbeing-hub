
import React from 'react';
import { Home, Wind, Music, CheckSquare, BarChart2 } from "lucide-react";
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activePage: 'home' | 'breathing' | 'music' | 'tips' | 'progress';
}

const Navigation: React.FC<NavigationProps> = ({ activePage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-50 py-2">
      <nav className="max-w-md mx-auto flex justify-around items-center px-4">
        <NavItem to="/" icon={<Home />} label="Home" active={activePage === 'home'} />
        <NavItem to="/breathing" icon={<Wind />} label="Breathe" active={activePage === 'breathing'} />
        <NavItem to="/music" icon={<Music />} label="Music" active={activePage === 'music'} />
        <NavItem to="/tips" icon={<CheckSquare />} label="Tips" active={activePage === 'tips'} />
        <NavItem to="/progress" icon={<BarChart2 />} label="Progress" active={activePage === 'progress'} />
      </nav>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, active }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center py-1 px-2 text-sm transition-all duration-200",
        active ? "text-serenity-green nav-item-active" : "text-gray-500"
      )}
    >
      <div className="mb-1">
        {icon}
      </div>
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export default Navigation;
