import { motion } from 'motion/react';
import { Wand2 } from 'lucide-react';
import { useState } from 'react';

interface LoginScreenProps {
  key?: string;
  onLogin: () => void;
  isTransitioning: boolean;
}

export default function LoginScreen({ onLogin, isTransitioning }: LoginScreenProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);
    onLogin();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-[var(--color-primary-light)] overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[var(--color-purple-light)] rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-[var(--color-accent)] rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse" />

      {/* Main interaction */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.button
          onClick={handleClick}
          whileTap={{ scale: 0.95 }}
          className="relative w-32 h-32 rounded-full glass bg-white/40 flex items-center justify-center cursor-pointer shadow-lg group"
        >
          {/* Inner glow circle */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-cheer-orange)] opacity-20 group-hover:opacity-40 transition-opacity duration-500 blur-sm" />
          
          <Wand2 size={48} className="text-[var(--color-cheer-orange)] drop-shadow-md z-10 relative" />
          
          {/* Ongoing soft glow */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute inset-[-10px] rounded-full border border-[var(--color-cheer-orange)] opacity-30"
          />
        </motion.button>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-gray-500 font-extrabold tracking-widest text-sm"
        >
          轻触点亮星光
        </motion.p>
      </div>

      {/* Halo Transition */}
      {isTransitioning && (
        <motion.div
          initial={{ scale: 0, opacity: 0.8 }}
          animate={{ scale: 50, opacity: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute z-50 w-24 h-24 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-purple-light)] pointer-events-none"
          style={{ top: '50%', left: '50%', marginTop: '-3rem', marginLeft: '-3rem' }}
        />
      )}
    </motion.div>
  );
}
