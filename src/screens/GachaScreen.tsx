import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Sparkles, X, Gift, Wand2, Info } from 'lucide-react';
import Confetti from '../components/Confetti';

interface GachaScreenProps {
  key?: string;
  onMenuClick: () => void;
  glowSticks: number;
  setGlowSticks: (n: number) => void;
}

const POOLS = [
  {
    id: 'starlight',
    title: '星光梦境系列',
    subtitle: '第一弹小卡与拍立得套组',
    color: 'from-[#FFB7B2] to-[#FFDAC1]',
    borderColor: 'border-[#FFB7B2]',
    image: 'https://picsum.photos/seed/gacha1/400/300',
    prizes: [
      { rarity: 'SP', rate: '1.5%', name: '全息典藏卡', image: 'https://picsum.photos/seed/prize_sp/100/100', color: 'from-[#ff9eb5] to-[#ffb3c6]' },
      { rarity: 'SSR', rate: '5.0%', name: '限定立牌', image: 'https://picsum.photos/seed/p2/100/100', color: 'from-[#ff6b6b] to-[#ff8787]' },
      { rarity: 'SR', rate: '15.0%', name: 'Q版徽章', image: 'https://picsum.photos/seed/p3/100/100', color: 'from-[#ffa94d] to-[#ffc078]' },
      { rarity: 'R', rate: '30.0%', name: '演唱会明信片', image: 'https://picsum.photos/seed/px/100/100', color: 'from-[#b197fc] to-[#d0bfff]' },
      { rarity: 'N', rate: '48.5%', name: '基础徽章', image: 'https://picsum.photos/seed/py/100/100', color: 'from-[#74c0fc] to-[#a5d8ff]' },
    ]
  },
  {
    id: 'ocean',
    title: '夏日海风派对',
    subtitle: '夏日限定立牌与吧唧',
    color: 'from-[#B5EAD7] to-[#C7CEEA]',
    borderColor: 'border-[#B5EAD7]',
    image: 'https://picsum.photos/seed/gacha2/400/300',
    prizes: [
      { rarity: 'SP', rate: '1.2%', name: '泳装隐藏卡', image: 'https://picsum.photos/seed/pz/100/100', color: 'from-[#ff9eb5] to-[#ffb3c6]' },
      { rarity: 'SSR', rate: '6.0%', name: '冲浪立牌', image: 'https://picsum.photos/seed/pw/100/100', color: 'from-[#ff6b6b] to-[#ff8787]' },
      { rarity: 'SR', rate: '18.0%', name: '沙滩巾周边', image: 'https://picsum.photos/seed/pv/100/100', color: 'from-[#ffa94d] to-[#ffc078]' },
      { rarity: 'R', rate: '74.8%', name: '夏日饮品吧唧', image: 'https://picsum.photos/seed/pu/100/100', color: 'from-[#b197fc] to-[#d0bfff]' },
    ]
  },
  {
    id: 'winter',
    title: '冬日雪景系列',
    subtitle: '毛绒挂件与透卡体验',
    color: 'from-[#C7CEEA] to-[#E2F0CB]',
    borderColor: 'border-[#C7CEEA]',
    image: 'https://picsum.photos/seed/gachaW/400/300',
    prizes: [
      { rarity: 'SP', rate: '1.0%', name: '初雪签名照', image: 'https://picsum.photos/seed/pw1/100/100', color: 'from-[#ff9eb5] to-[#ffb3c6]' },
      { rarity: 'SSR', rate: '4.0%', name: '毛绒玩偶挂件', image: 'https://picsum.photos/seed/pw2/100/100', color: 'from-[#ff6b6b] to-[#ff8787]' },
      { rarity: 'SR', rate: '20.0%', name: '雪景透卡', image: 'https://picsum.photos/seed/pw3/100/100', color: 'from-[#ffa94d] to-[#ffc078]' },
      { rarity: 'R', rate: '75.0%', name: '保温杯贴纸', image: 'https://picsum.photos/seed/pw4/100/100', color: 'from-[#b197fc] to-[#d0bfff]' },
    ]
  },
  {
    id: 'anniversary',
    title: '一周年纪念',
    subtitle: '典藏花嫁立牌及特典',
    color: 'from-[#FFDAC1] to-[#FF9AA2]',
    borderColor: 'border-[#FFDAC1]',
    image: 'https://picsum.photos/seed/gachaA/400/300',
    prizes: [
      { rarity: 'SP', rate: '2.0%', name: '花嫁超大立牌', image: 'https://picsum.photos/seed/pa1/100/100', color: 'from-[#ff9eb5] to-[#ffb3c6]' },
      { rarity: 'SSR', rate: '8.0%', name: '周年庆戒指', image: 'https://picsum.photos/seed/pa2/100/100', color: 'from-[#ff6b6b] to-[#ff8787]' },
      { rarity: 'SR', rate: '90.0%', name: '纪念版信珠', image: 'https://picsum.photos/seed/pa3/100/100', color: 'from-[#ffa94d] to-[#ffc078]' },
    ]
  }
];

export default function GachaScreen({ onMenuClick, glowSticks, setGlowSticks }: GachaScreenProps) {
  const [selectedPool, setSelectedPool] = useState(POOLS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [previewPrize, setPreviewPrize] = useState<any>(null);

  const handleDraw = () => {
    setIsDrawing(true);
    // Simulate drawing animation delay
    setTimeout(() => {
      setIsDrawing(false);
      setShowResult(true);
      // Buying Gacha grants glow sticks based on price
      setGlowSticks(glowSticks + 300);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#FAFAFA] flex flex-col overflow-hidden"
    >
      {/* Floating Header */}
      <div className="absolute top-0 inset-x-0 z-20 pt-10 px-6 pb-6 flex justify-between items-center bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent pointer-events-none">
        <button
          onClick={onMenuClick}
          className="p-3 rounded-full glass bg-white/70 shadow-sm text-gray-800 hover:bg-white active:scale-95 transition-all pointer-events-auto border border-white backdrop-blur-md"
        >
          <Menu size={24} />
        </button>
        <span className="font-extrabold text-gray-800 text-lg tracking-widest uppercase drop-shadow-sm pointer-events-auto">星盲盒</span>
        
        {/* Glow Sticks Balance Display */}
        <div className="flex items-center gap-1 font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] shadow-md px-3 py-1.5 rounded-full text-sm pointer-events-auto border border-white/50">
          <Wand2 size={16} /> {glowSticks}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-28 pb-[200px]">
        {/* Removed overly prominent Rules Prompt */}
        
        <div className="flex flex-col gap-8 px-6">
          {POOLS.map(pool => (
            <motion.div
              layout
              key={pool.id}
              onClick={() => setSelectedPool(pool)}
              className={`relative overflow-hidden rounded-[2rem] cursor-pointer transition-all duration-300 border-4 block ${
                selectedPool.id === pool.id ? pool.borderColor + ' shadow-2xl scale-[1.02]' : 'border-transparent soft-shadow scale-100 opacity-90'
              } bg-white flex flex-col`}
            >
              <div className="h-44 overflow-hidden relative">
                <img src={pool.image} alt={pool.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent mix-blend-overlay opacity-80`} />
              </div>
              
              <div className="p-5 flex-1 bg-white">
                <h3 className="font-extrabold text-2xl text-gray-800 tracking-tight">{pool.title}</h3>
                <p className="text-sm font-bold text-gray-400 mt-1 mb-2">{pool.subtitle}</p>
                
                {selectedPool.id === pool.id && (
                  <div className="absolute top-4 right-4 glass bg-black/30 p-2.5 rounded-full text-white shadow-xl backdrop-blur-md">
                    <Sparkles size={22} />
                  </div>
                )}
                
                {/* Visual Preview of Prizes - Fixed Swiping using framer-motion drag */}
                <AnimatePresence>
                  {selectedPool.id === pool.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2 relative overflow-hidden"
                      onClick={(e) => e.stopPropagation()} // Prevent card collapse action when clicking around prizes
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 text-[var(--color-primary)]">
                          <Info size={16} />
                          <span className="text-xs font-bold uppercase tracking-wider relative z-20">奖品一览表 (可左右滑动)</span>
                        </div>
                      </div>
                      
                      <PrizeCarousel 
                        prizes={pool.prizes} 
                        onPrizeClick={(pz) => setPreviewPrize(pz)} 
                      />
                      
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Docked Integration Area for Button */}
      <div className="absolute bottom-0 inset-x-0 z-30 px-6 pt-24 pb-[100px] bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent pointer-events-none flex items-end">
        <motion.button
          onClick={handleDraw}
          whileTap={{ scale: 0.95 }}
          className={`pointer-events-auto w-full py-4 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-2xl text-white bg-gradient-to-r ${selectedPool.color} border-2 border-white/80 transition-all z-10`}
        >
          {isDrawing ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="py-2">
              <Sparkles size={28} />
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-2 font-extrabold text-xl">
                <Gift size={24} /> 
                <span className="drop-shadow-md tracking-wider">抽 1 次</span> 
                <span className="bg-black/15 px-3 py-1 rounded-xl text-sm font-black whitespace-nowrap shadow-inner backdrop-blur-md">¥ 29.9</span>
              </div>
              <div className="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full shadow-inner mt-1 drop-shadow-sm flex items-center gap-1">
                必得周边商品 +<Wand2 size={12}/> 300 荧光棒
              </div>
            </>
          )}
        </motion.button>
      </div>

      {/* Reward Preview Modal */}
      <AnimatePresence>
        {previewPrize && (
          <PreviewModal onClose={() => setPreviewPrize(null)} prize={previewPrize} pool={selectedPool} />
        )}
      </AnimatePresence>

      {/* Draw Result Modal */}
      <AnimatePresence>
        {showResult && (
          <ResultModal onClose={() => setShowResult(false)} pool={selectedPool} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Draggable Carousel Component that guarantees horizontal swiping works universally
function PrizeCarousel({ prizes, onPrizeClick }: { prizes: any[], onPrizeClick: (pz: any) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div 
      ref={containerRef} 
      className="w-full overflow-hidden cursor-grab active:cursor-grabbing pb-2" 
      style={{ touchAction: 'pan-y' }} // Allows vertical page scroll, locks horizontal for drag
    >
      <motion.div 
        drag="x" 
        dragConstraints={containerRef} 
        dragDirectionLock 
        className="flex gap-3 w-max px-1"
      >
        {prizes.map((pz, idx) => (
          <motion.div 
            key={idx} 
            onClick={() => onPrizeClick(pz)}
            whileTap={{ scale: 0.95 }}
            className="shrink-0 w-28 flex flex-col items-center bg-[#FAFAFA] p-2.5 rounded-[1.5rem] border border-gray-100 soft-shadow pointer-events-auto"
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden mb-2 shadow-sm border-2 border-white relative pointer-events-none">
              <img src={pz.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className={`absolute inset-0 bg-gradient-to-tr ${pz.color} mix-blend-overlay opacity-60`} />
            </div>
            <span className={`text-[10px] font-extrabold px-2 py-[2px] rounded-md m-1 text-white bg-gradient-to-r ${pz.color} leading-tight drop-shadow-sm pointer-events-none`}>
              {pz.rarity}
            </span>
            <span className="text-xs font-extrabold text-gray-700 text-center leading-tight truncate w-full pointer-events-none">{pz.name}</span>
            <span className="text-[10px] items-center font-bold text-gray-500 mt-1.5 bg-white px-2 py-0.5 rounded-full shadow-inner pointer-events-none">{pz.rate}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Modal for previewing a specific card from the pool
function PreviewModal({ onClose, prize, pool }: { onClose: () => void, prize: any, pool: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm cursor-pointer"
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking card
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-6 flex flex-col items-center text-center shadow-2xl overflow-hidden glass border border-white"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 z-20 pointer-events-auto"
        >
          <X size={20} />
        </button>

        <span className={`inline-block px-5 py-1.5 rounded-full bg-gradient-to-r ${prize.color} text-white font-extrabold text-sm uppercase tracking-widest shadow-sm mb-4 z-10 relative border border-white/50`}>
          {prize.rarity} 品质详情
        </span>

        <div className={`relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl mb-6 z-10 border-4 border-white bg-gradient-to-br ${prize.color}`}>
          <img src={prize.image} className="w-full h-full object-cover mix-blend-overlay opacity-90" referrerPolicy="no-referrer" />
          <img src={prize.image} className="absolute inset-0 w-full h-full object-contain drop-shadow-md p-4" referrerPolicy="no-referrer" />
        </div>

        <h3 className="text-2xl font-extrabold text-gray-800 z-10 relative mb-1">{prize.name}</h3>
        <p className="text-gray-500 font-bold text-sm z-10 relative bg-gray-100 px-3 py-1 rounded-full drop-shadow-sm mt-3">
          在此卡池中抽取概率: <span className="text-[var(--color-primary)] text-lg px-1">{prize.rate}</span>
        </p>

      </motion.div>
    </motion.div>
  );
}

function ResultModal({ onClose, pool }: { onClose: () => void, pool: any }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
    >
      <Confetti />
      
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl overflow-hidden glass border border-white/50"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${pool.color} opacity-20`} />
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100/50 hover:bg-gray-200/50 text-gray-500 z-10 transition-colors"
        >
          <X size={20} />
        </button>

        <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-extrabold text-xs uppercase tracking-widest shadow-sm mb-6 z-10 relative">
          SP 典藏款
        </span>

        <div className={`relative w-48 h-64 rounded-2xl overflow-hidden shadow-2xl mb-6 z-10 border-4 border-white bg-gradient-to-br ${pool.color}`}>
           <img src={pool.prizes[0].image} className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90" referrerPolicy="no-referrer" />
           <img src={pool.prizes[0].image} className="w-full h-full object-contain drop-shadow-md p-2" referrerPolicy="no-referrer" />
        </div>

        <h3 className="text-2xl font-extrabold text-gray-800 z-10 relative mb-2">{pool.prizes[0].name}</h3>
        <p className="text-xs font-bold text-orange-500 bg-orange-100 px-3 py-1 rounded-full mb-3 inline-block z-10 relative">
          额外获得 300 荧光棒！
        </p>
        <p className="text-gray-500 font-medium text-sm z-10 relative">物品已放入背包</p>

        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.95 }}
          className="mt-8 w-full py-4 rounded-xl font-bold bg-white text-gray-800 soft-shadow border border-gray-100 relative z-10"
        >
          太棒了！
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
