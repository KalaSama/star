import React from 'react';
import { Gem } from 'lucide-react';

interface FanBadgeProps {
  level: number;
  name: string;
  className?: string;
}

export default function FanBadge({ level, name, className = '' }: FanBadgeProps) {
  let bgClass = '';
  let borderClass = '';
  let shadowClass = '';
  let iconColor = '';

  if (level < 4) {
    bgClass = 'bg-gradient-to-r from-blue-400 to-indigo-500';
    borderClass = 'border-blue-300';
    shadowClass = 'shadow-blue-500/30';
    iconColor = 'text-white';
  } else if (level < 8) {
    bgClass = 'bg-gradient-to-r from-yellow-400 to-orange-500';
    borderClass = 'border-yellow-300';
    shadowClass = 'shadow-orange-500/30';
    iconColor = 'text-yellow-100';
  } else {
    bgClass = 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500';
    borderClass = 'border-pink-300';
    shadowClass = 'shadow-purple-500/40';
    iconColor = 'text-pink-100';
  }

  return (
    <div className={`inline-flex w-fit flex-shrink-0 flex-grow-0 px-2 py-0.5 rounded-full text-[10px] font-black text-white ${bgClass} shadow-sm ${shadowClass} items-center gap-1 border border-white/20 ${className}`}>
      <span className="relative flex items-center justify-center">
        <Gem size={12} className={`${iconColor}`} fill="currentColor" />
        {/* We can put the level inside or next to the gem */}
        <span className="absolute text-[6px] font-black text-white mt-[1px]">{level}</span>
      </span>
      <span className="opacity-90">{name}</span>
      <span className="opacity-80 font-bold ml-0.5">Lv.{level}</span>
    </div>
  );
}
