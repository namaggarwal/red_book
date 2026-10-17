import React from 'react';
import { useApp, ActiveScreen } from '../../context/AppContext';
import {
  Home,
  TrendingUp,
  Clock,
  Sparkles,
  Menu,
  Plus,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, openQuickAdd } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'growth', label: 'Growth', icon: TrendingUp },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'development', label: 'Development', icon: Sparkles },
    { id: 'more', label: 'More', icon: Menu },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-stone-200/80 px-2 py-1.5 safe-area-bottom shadow-lg">
      <div className="flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (item.id === 'more' &&
              ['vaccines', 'reviews', 'events', 'appointments', 'notes', 'feeding', 'reports', 'settings'].includes(
                currentScreen
              ));

          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id as ActiveScreen)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'text-berry-700 font-semibold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.7]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
