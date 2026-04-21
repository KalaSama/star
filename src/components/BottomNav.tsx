import { motion } from 'motion/react';
import { Home, Gift, Briefcase } from 'lucide-react';
import { ScreenState } from '../App';

interface BottomNavProps {
  currentScreen: ScreenState;
  onNavigate: (screen: ScreenState) => void;
}

export default function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const tabs = [
    { id: 'home', icon: Home },
    { id: 'gacha', icon: Gift, label: '星盲盒' },
    { id: 'backpack', icon: Briefcase, label: '我的周边' },
  ] as const;

  return (
    <div className="absolute bottom-0 inset-x-0 z-40">
      {/* Docked Full-Width Glass Bar */}
      <div className="bg-white/70 backdrop-blur-3xl border-t border-white/60 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pt-3 pb-6 px-12 flex justify-between items-center rounded-t-[2.5rem] relative overflow-hidden">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentScreen === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className="relative flex items-center justify-center z-10 transition-colors w-16 h-14"
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavBubble"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  className="absolute inset-0 bg-pink-100/50 rounded-full z-0"
                />
              )}
              <div className="relative flex items-center justify-center p-3 z-10">
                <Icon
                  size={isActive ? 32 : 28}
                  className={`transition-all duration-300 ${
                    isActive ? 'text-[var(--color-primary)] drop-shadow-sm' : 'text-gray-500'
                  }`}
                  fill={isActive ? 'currentColor' : 'transparent'}
                  strokeWidth={isActive ? 0 : 2}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
