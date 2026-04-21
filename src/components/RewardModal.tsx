import { motion, AnimatePresence } from 'motion/react';
import { X, Gift } from 'lucide-react';
import React from 'react';
import Confetti from './Confetti'; // Assuming Confetti component exists

interface RewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  rewards: { name: string; amount: number; icon: React.ReactNode }[];
}

export default function RewardModal({ isOpen, onClose, title = "恭喜获得奖励", rewards }: RewardModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[120] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
        >
          <Confetti count={80} />
          <motion.div
            initial={{ scale: 0.8, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 30, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-sm bg-white rounded-[2.5rem] relative shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header / Banner */}
            <div className="bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 p-8 flex flex-col items-center relative overflow-hidden">
              <Gift size={100} className="absolute -top-6 -right-6 text-white/20 rotate-12" />
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white mb-4 border border-white/40 shadow-xl">
                <Gift size={40} className="drop-shadow-md" />
              </div>
              <h2 className="text-2xl font-black text-white drop-shadow-md tracking-wider">{title}</h2>
            </div>
            
            {/* Rewards */}
            <div className="px-6 py-8 flex flex-col gap-4 items-center bg-[#FAFAFA]">
               {rewards.map((r, i) => (
                 <div key={i} className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl w-full border border-gray-100 shadow-sm justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-50 text-[var(--color-primary)] flex items-center justify-center">
                        {r.icon}
                      </div>
                      <span className="font-extrabold text-gray-800">{r.name}</span>
                    </div>
                    <span className="font-black text-xl text-[var(--color-primary)]">+{r.amount}</span>
                 </div>
               ))}
               
               <button 
                 onClick={onClose}
                 className="mt-4 w-full py-4 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] text-white rounded-2xl font-black text-lg shadow-lg shadow-[var(--color-primary)]/30 active:scale-95 transition-transform"
               >
                 开心收下
               </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
