import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const COLORS = ['#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA', '#FF9A76', '#39FF14'];

export default function Confetti() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate 50 particles
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // vw
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 0.5,
      scale: Math.random() * 0.5 + 0.5,
      rotation: Math.random() * 360,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ top: '-10%', left: `${p.x}%`, rotate: p.rotation, scale: p.scale, opacity: 1 }}
          animate={{
            top: '110%',
            rotate: p.rotation + (Math.random() * 360 * 2), // spin while falling
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: p.delay,
            ease: 'easeOut',
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}
