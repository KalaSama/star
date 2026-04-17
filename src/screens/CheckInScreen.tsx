import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, CalendarCheck, CheckCircle2, Wand2 } from 'lucide-react';
import { useState } from 'react';

interface CheckInScreenProps {
  key?: string;
  onBack: () => void;
  glowSticks: number;
  setGlowSticks: (n: number) => void;
}

const DAYS = [
  { day: 1, reward: 50 },
  { day: 2, reward: 50 },
  { day: 3, reward: 80 },
  { day: 4, reward: 50 },
  { day: 5, reward: 100 },
  { day: 6, reward: 50 },
  { day: 7, reward: 300, isBig: true },
];

export default function CheckInScreen({ onBack, glowSticks, setGlowSticks }: CheckInScreenProps) {
  const [currentDay, setCurrentDay] = useState(6); // Pretend it's day 6
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);

  const handleCheckIn = () => {
    if (hasCheckedIn) return;
    setHasCheckedIn(true);
    setCurrentDay(7);
    setShowRewardAnimation(true);
    
    setTimeout(() => {
      setGlowSticks(glowSticks + 300);
      setShowRewardAnimation(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-[#FAFAFA] flex flex-col z-50 text-left" 
    >
      {/* Modern, borderless header matching Gacha/Backpack */}
      <div className="absolute top-0 inset-x-0 z-20 pt-10 px-6 pb-6 flex justify-between items-center bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent pointer-events-none">
        <button
          onClick={onBack}
          className="p-3 rounded-full glass bg-white/70 shadow-sm text-gray-800 hover:bg-white active:scale-95 transition-all pointer-events-auto border border-white backdrop-blur-md"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-extrabold text-gray-800 text-lg tracking-widest uppercase drop-shadow-sm pointer-events-auto">每日签到</span>
        <div className="flex items-center gap-1.5 font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] px-3 py-1.5 rounded-full text-sm shadow-md pointer-events-auto border border-white/50">
          <Wand2 size={16} /> {glowSticks}
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-32 pb-32 overflow-y-auto">
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-cheer-orange)] rounded-full flex items-center justify-center text-white shadow-xl shadow-[var(--color-primary)]/40 mb-5 scale-110 border-4 border-white">
            <CalendarCheck size={36} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 text-center tracking-tight">每日奖励</h2>
          <p className="text-gray-500 font-bold text-center mt-2 text-sm bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">连续签到获取更多荧光棒！</p>
        </div>

        {/* Calendar Grid Layout Fixed - Day 7 spans 2 cols but only 1 row to fix overflow */}
        <div className="grid grid-cols-4 gap-3 bg-white p-5 rounded-[2.5rem] shadow-xl shadow-[var(--color-primary)]/5 border-2 border-white">
          {DAYS.map((d) => {
            const isPast = d.day < currentDay || (d.day === 7 && hasCheckedIn);
            const isToday = d.day === currentDay && !hasCheckedIn;
            
            return (
              <div 
                key={d.day} 
                className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-2xl ${
                  d.isBig ? 'col-span-2 row-span-1' : 'col-span-1'
                } ${
                  isPast ? 'bg-gray-50' :
                  isToday ? 'bg-gradient-to-tr from-[var(--color-primary-light)] to-[var(--color-primary)] shadow-md transform scale-105 z-10 border border-white/50' :
                  'bg-white border border-gray-100'
                } transition-all duration-300`}
              >
                {isPast && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-2xl z-20 backdrop-blur-[2px]">
                    <CheckCircle2 className="text-green-500 drop-shadow-sm" size={32} />
                  </div>
                )}
                
                <span className={`text-[11px] font-black mb-1.5 uppercase ${isToday ? 'text-white/90' : 'text-gray-400'}`}>
                  DAY {d.day}
                </span>
                
                <Wand2 size={d.isBig ? 40 : 26} className={`mb-1.5 ${isToday ? 'text-white' : 'text-orange-400 drop-shadow-sm'}`} />
                
                <span className={`font-bold ${d.isBig ? 'text-lg mt-1' : 'text-sm'} ${isToday ? 'text-white' : 'text-gray-700'}`}>
                  +{d.reward}
                </span>
              </div>
            );
          })}
        </div>

        <motion.button
          onClick={handleCheckIn}
          disabled={hasCheckedIn}
          whileTap={{ scale: hasCheckedIn ? 1 : 0.95 }}
          className={`mt-10 w-full py-5 rounded-3xl font-extrabold text-xl shadow-xl transition-all ${
            hasCheckedIn
              ? 'bg-gray-100 text-gray-400 shadow-none border border-gray-200'
              : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] text-white border-2 border-white/50'
          }`}
        >
          {hasCheckedIn ? '今日已签' : '领取今日奖励'}
        </motion.button>
      </div>

      {/* Fly-in Animation Overlay */}
      <AnimatePresence>
        {showRewardAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1.5, y: -100, opacity: [1, 1, 0] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="text-[var(--color-cheer-orange)] font-extrabold text-4xl drop-shadow-xl flex items-center gap-2"
            >
              +300 <Wand2 size={40} className="animate-spin-slow" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
