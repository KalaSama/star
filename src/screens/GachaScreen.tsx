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
    color: 'from-blue-100 to-pink-100', // unified clean gradient instead of dark ones
    borderColor: 'border-[#ffb3c6]',
    image: 'https://picsum.photos/seed/idol1/600/400', // Star concept
    prizes: [
      { rarity: 'SP', rate: '1.5%', name: '全息典藏卡', image: 'https://picsum.photos/seed/prize1/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '5.0%', name: '限定立牌', image: 'https://picsum.photos/seed/prize2/300/400', color: 'from-[#ff6b6b] to-[#ff8787]', textColor: 'text-[#c92a2a]' },
      { rarity: 'SR', rate: '15.0%', name: 'Q版徽章', image: 'https://picsum.photos/seed/prize3/300/400', color: 'from-[#ffa94d] to-[#ffc078]', textColor: 'text-[#e67700]' },
      { rarity: 'R', rate: '30.0%', name: '演唱会明信片', image: 'https://picsum.photos/seed/prize4/300/400', color: 'from-[#b197fc] to-[#d0bfff]', textColor: 'text-[#6741d9]' },
      { rarity: 'N', rate: '48.5%', name: '基础徽章', image: 'https://picsum.photos/seed/prize5/300/400', color: 'from-[#74c0fc] to-[#a5d8ff]', textColor: 'text-[#1864ab]' },
    ]
  },
  {
    id: 'ocean',
    title: '夏日海风派对',
    subtitle: '夏日限定立牌与吧唧',
    color: 'from-cyan-50 to-blue-100',
    borderColor: 'border-[#B5EAD7]',
    image: 'https://picsum.photos/seed/idol2/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.2%', name: '泳装隐藏卡', image: 'https://picsum.photos/seed/prize6/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '6.0%', name: '冲浪立牌', image: 'https://picsum.photos/seed/prize7/300/400', color: 'from-[#ff6b6b] to-[#ff8787]', textColor: 'text-[#c92a2a]' },
      { rarity: 'SR', rate: '18.0%', name: '沙滩巾周边', image: 'https://picsum.photos/seed/prize8/300/400', color: 'from-[#ffa94d] to-[#ffc078]', textColor: 'text-[#e67700]' },
      { rarity: 'R', rate: '74.8%', name: '夏日饮品吧唧', image: 'https://picsum.photos/seed/prize9/300/400', color: 'from-[#b197fc] to-[#d0bfff]', textColor: 'text-[#6741d9]' },
    ]
  },
  {
    id: 'cyber',
    title: '赛博霓虹之夜',
    subtitle: '电子风炫酷手办与立牌',
    color: 'from-purple-100 to-indigo-100',
    borderColor: 'border-[#b197fc]',
    image: 'https://picsum.photos/seed/idol3/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.5%', name: '夜光手办', image: 'https://picsum.photos/seed/prize10/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '5.0%', name: '镭射立牌', image: 'https://picsum.photos/seed/prize11/300/400', color: 'from-[#b197fc] to-[#d0bfff]', textColor: 'text-[#6741d9]' },
      { rarity: 'SR', rate: '15.0%', name: '发光徽章', image: 'https://picsum.photos/seed/prize12/300/400', color: 'from-[#ffa94d] to-[#ffc078]', textColor: 'text-[#e67700]' },
      { rarity: 'R', rate: '78.5%', name: '赛博明信片', image: 'https://picsum.photos/seed/prize13/300/400', color: 'from-[#74c0fc] to-[#a5d8ff]', textColor: 'text-[#1864ab]' },
    ]
  },
  {
    id: 'tea',
    title: '午后红茶悠哉',
    subtitle: '英伦风下午茶周边套组',
    color: 'from-orange-50 to-amber-100',
    borderColor: 'border-[#ffc078]',
    image: 'https://picsum.photos/seed/idol4/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.0%', name: '定制茶杯套装', image: 'https://picsum.photos/seed/prize14/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '5.5%', name: '茶具立牌', image: 'https://picsum.photos/seed/prize15/300/400', color: 'from-[#ffc078] to-[#ffd8a8]', textColor: 'text-[#e67700]' },
      { rarity: 'SR', rate: '16.5%', name: '甜点徽章', image: 'https://picsum.photos/seed/prize16/300/400', color: 'from-[#b197fc] to-[#d0bfff]', textColor: 'text-[#6741d9]' },
      { rarity: 'R', rate: '77.0%', name: '下午茶明信片', image: 'https://picsum.photos/seed/prize17/300/400', color: 'from-[#74c0fc] to-[#a5d8ff]', textColor: 'text-[#1864ab]' },
    ]
  },
  {
    id: 'winter',
    title: '幻雪奇缘冬日',
    subtitle: '雪人与冬季恋歌',
    color: 'from-blue-50 to-indigo-50',
    borderColor: 'border-[#a5d8ff]',
    image: 'https://picsum.photos/seed/idol5/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.5%', name: '雪花水晶球', image: 'https://picsum.photos/seed/prize18/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '6.0%', name: '滑雪立牌', image: 'https://picsum.photos/seed/prize19/300/400', color: 'from-[#a5d8ff] to-[#d0ebff]', textColor: 'text-[#1864ab]' },
      { rarity: 'SR', rate: '18.0%', name: '毛绒挂件', image: 'https://picsum.photos/seed/prize20/300/400', color: 'from-[#ffc078] to-[#ffd8a8]', textColor: 'text-[#e67700]' },
      { rarity: 'R', rate: '74.5%', name: '雪地明信片', image: 'https://picsum.photos/seed/prize21/300/400', color: 'from-[#b197fc] to-[#d0bfff]', textColor: 'text-[#6741d9]' },
    ]
  },
  {
    id: 'sakura',
    title: '樱花绽放之时',
    subtitle: '和风樱吹雪限定纪念',
    color: 'from-pink-50 to-rose-100',
    borderColor: 'border-[#ffb3c6]',
    image: 'https://picsum.photos/seed/idol6/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.0%', name: '樱花折扇', image: 'https://picsum.photos/seed/prize22/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '5.0%', name: '和服立牌', image: 'https://picsum.photos/seed/prize23/300/400', color: 'from-[#ff6b6b] to-[#ff8787]', textColor: 'text-[#c92a2a]' },
      { rarity: 'SR', rate: '15.0%', name: '樱花御守', image: 'https://picsum.photos/seed/prize24/300/400', color: 'from-[#ffa94d] to-[#ffc078]', textColor: 'text-[#e67700]' },
      { rarity: 'R', rate: '79.0%', name: '赏樱明信片', image: 'https://picsum.photos/seed/prize25/300/400', color: 'from-[#74c0fc] to-[#a5d8ff]', textColor: 'text-[#1864ab]' },
    ]
  },
  {
    id: 'space',
    title: '星际巡航日记',
    subtitle: '科幻风满载的太空征途',
    color: 'from-gray-800 to-indigo-900',
    borderColor: 'border-[#66d9e8]',
    image: 'https://picsum.photos/seed/idol7/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.2%', name: '宇航员漫游手办', image: 'https://picsum.photos/seed/prize26/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '6.5%', name: '流星雨立牌', image: 'https://picsum.photos/seed/prize27/300/400', color: 'from-[#b197fc] to-[#d0bfff]', textColor: 'text-[#6741d9]' },
      { rarity: 'SR', rate: '14.0%', name: '星球徽章', image: 'https://picsum.photos/seed/prize28/300/400', color: 'from-[#66d9e8] to-[#99e9f2]', textColor: 'text-[#0b7285]' },
      { rarity: 'R', rate: '78.3%', name: '登月明信片', image: 'https://picsum.photos/seed/prize29/300/400', color: 'from-[#a5d8ff] to-[#d0ebff]', textColor: 'text-[#1864ab]' },
    ]
  },
  {
    id: 'halloween',
    title: '万圣惊魂奇遇',
    subtitle: '调皮捣蛋万圣夜',
    color: 'from-orange-100 to-purple-100',
    borderColor: 'border-[#ffa8a8]',
    image: 'https://picsum.photos/seed/idol8/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.1%', name: '南瓜灯音乐盒', image: 'https://picsum.photos/seed/prize30/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '5.8%', name: '吸血鬼立牌', image: 'https://picsum.photos/seed/prize31/300/400', color: 'from-[#ff8787] to-[#ffa8a8]', textColor: 'text-[#c92a2a]' },
      { rarity: 'SR', rate: '17.0%', name: '幽灵吧唧', image: 'https://picsum.photos/seed/prize32/300/400', color: 'from-[#b197fc] to-[#d0bfff]', textColor: 'text-[#6741d9]' },
      { rarity: 'R', rate: '76.1%', name: '不给糖就捣蛋明信片', image: 'https://picsum.photos/seed/prize33/300/400', color: 'from-[#ffc078] to-[#ffd8a8]', textColor: 'text-[#e67700]' },
    ]
  },
  {
    id: 'magic',
    title: '魔法学园入校',
    subtitle: '闪耀的魔法杖与魔导书',
    color: 'from-indigo-100 to-blue-100',
    borderColor: 'border-[#91a7ff]',
    image: 'https://picsum.photos/seed/idol9/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.0%', name: '发光魔法杖模型', image: 'https://picsum.photos/seed/prize34/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '5.0%', name: '制服立牌', image: 'https://picsum.photos/seed/prize35/300/400', color: 'from-[#91a7ff] to-[#bac8ff]', textColor: 'text-[#3b5bdb]' },
      { rarity: 'SR', rate: '16.0%', name: '魔药瓶挂件', image: 'https://picsum.photos/seed/prize36/300/400', color: 'from-[#b197fc] to-[#d0bfff]', textColor: 'text-[#6741d9]' },
      { rarity: 'R', rate: '78.0%', name: '入学通知书', image: 'https://picsum.photos/seed/prize37/300/400', color: 'from-[#ffd8a8] to-[#ffec99]', textColor: 'text-[#e67700]' },
    ]
  },
  {
    id: 'festival',
    title: '音乐节狂欢热',
    subtitle: '夏日草地音乐节纪念',
    color: 'from-green-50 to-emerald-100',
    borderColor: 'border-[#69db7c]',
    image: 'https://picsum.photos/seed/idol10/600/400',
    prizes: [
      { rarity: 'SP', rate: '1.3%', name: '签名吉他拨片', image: 'https://picsum.photos/seed/prize38/300/400', color: 'from-[#ff9eb5] to-[#ffb3c6]', textColor: 'text-[#ff4d6d]' },
      { rarity: 'SSR', rate: '5.5%', name: '舞台立牌', image: 'https://picsum.photos/seed/prize39/300/400', color: 'from-[#69db7c] to-[#b2f2bb]', textColor: 'text-[#2b8a3e]' },
      { rarity: 'SR', rate: '15.5%', name: '炫彩手环', image: 'https://picsum.photos/seed/prize40/300/400', color: 'from-[#ffa94d] to-[#ffc078]', textColor: 'text-[#e67700]' },
      { rarity: 'R', rate: '77.7%', name: '音乐节门票明信片', image: 'https://picsum.photos/seed/prize41/300/400', color: 'from-[#74c0fc] to-[#a5d8ff]', textColor: 'text-[#1864ab]' },
    ]
  }
];

export default function GachaScreen({ onMenuClick, glowSticks, setGlowSticks }: GachaScreenProps) {
  const [selectedPool, setSelectedPool] = useState(POOLS[0]);
  const [isDrawing1, setIsDrawing1] = useState(false);
  const [isDrawing10, setIsDrawing10] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [pullIntention, setPullIntention] = useState<number | null>(null);
  const [drawResults, setDrawResults] = useState<any[]>([]);
  const [previewPrize, setPreviewPrize] = useState<any>(null);

  const handleDrawIntent = (times: number) => {
    setPullIntention(times);
  };

  const executeDraw = () => {
    if (!pullIntention) return;
    const times = pullIntention;
    setPullIntention(null);

    // Set drawing state immediately
    if (times === 10) setIsDrawing10(true);
    else setIsDrawing1(true);
    
    // Create random results array based on pool
    const results = Array(times).fill(0).map(() => {
        // biased towards first element just for demonstration
        return selectedPool.prizes[Math.floor(Math.random() ** 3 * selectedPool.prizes.length)];
    });

    // Simulate drawing animation delay
    setTimeout(() => {
      setIsDrawing1(false);
      setIsDrawing10(false);
      setDrawResults(results);
      setShowResult(true);
      // Buying Gacha grants glow sticks based on price
      setGlowSticks(glowSticks + (300 * times));
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
        <button onClick={() => window.dispatchEvent(new CustomEvent('SHOW_GLOW_STICKS'))} className="flex items-center gap-1 font-bold text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] shadow-md px-3 py-1.5 rounded-full text-sm pointer-events-auto border border-white/50 hover:opacity-90 active:scale-95 transition-all">
          <Wand2 size={16} /> {glowSticks}
        </button>
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
      <div className="absolute bottom-0 inset-x-0 z-30 px-6 pt-24 pb-[90px] bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent pointer-events-none flex items-end gap-3">
        <motion.button
          onClick={() => handleDrawIntent(1)}
          whileTap={{ scale: 0.95 }}
          className={`pointer-events-auto flex-1 py-4 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-lg text-gray-700 bg-white border-2 border-white transition-all z-10`}
        >
          {isDrawing1 ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="py-2 text-[var(--color-primary)]">
              <Sparkles size={28} />
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-1 font-extrabold text-lg">
                <span className="tracking-wider text-gray-800">单抽</span> 
                <span className="bg-gray-100 px-2 py-0.5 rounded-lg text-xs font-black whitespace-nowrap shadow-inner text-gray-500">¥ 29.9</span>
              </div>
              <div className="text-[10px] font-bold text-gray-400 drop-shadow-sm flex items-center gap-1">
                必得周边 +300棒
              </div>
            </>
          )}
        </motion.button>

        <motion.button
          onClick={() => handleDrawIntent(10)}
          whileTap={{ scale: 0.95 }}
          className={`pointer-events-auto flex-[2] py-4 rounded-3xl flex flex-col items-center justify-center gap-1 shadow-2xl text-white bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] border-2 border-white/80 transition-all z-10`}
        >
          {isDrawing10 ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="py-2 text-white">
              <Sparkles size={28} />
            </motion.div>
          ) : (
            <>
              <div className="flex items-center gap-2 font-extrabold text-xl">
                <Gift size={24} /> 
                <span className="drop-shadow-md tracking-wider">十连抽</span> 
                <span className="bg-black/15 px-3 py-1 rounded-xl text-sm font-black whitespace-nowrap shadow-inner backdrop-blur-md">¥ 299</span>
              </div>
              <div className="text-[11px] font-bold bg-white/20 px-3 py-1 rounded-full shadow-inner mt-1 drop-shadow-sm flex items-center gap-1">
                必得稀有周边 +<Wand2 size={12}/> 3000棒
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

      {/* Draw Intent / Payment Modal */}
      <AnimatePresence>
        {pullIntention && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-6 flex flex-col shadow-2xl overflow-hidden glass border border-white"
            >
              <button
                onClick={() => setPullIntention(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 z-20 pointer-events-auto"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-extrabold text-gray-800 mb-4 text-center">支付抽盲盒</h3>
              
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100 flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                  <span>商品:</span>
                  <span className="text-gray-800">{selectedPool.title} {pullIntention === 10 ? '十连抽' : '单抽'}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                  <span>价格:</span>
                  <span className="text-[var(--color-primary)] text-lg">¥ {pullIntention === 10 ? '299.0' : '29.9'}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <p className="text-xs font-bold text-gray-500 mb-1">选择支付方式</p>
                <button onClick={executeDraw} className="bg-[#1AAD19] text-white rounded-xl py-3.5 font-bold shadow-md hover:bg-[#179b16] transition-colors">微信支付</button>
                <button onClick={executeDraw} className="bg-[#1677FF] text-white rounded-xl py-3.5 font-bold shadow-md hover:bg-[#146bdf] transition-colors">支付宝</button>
              </div>

              <p className="text-[10px] text-gray-400 mt-5 text-center px-4 font-medium leading-tight">
                确认支付即表示同意盲盒抽奖《用户协议》。盲盒一经开启，非质量问题不支持退换。
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draw Result Modal */}
      <AnimatePresence>
        {showResult && (
          <ResultModal onClose={() => setShowResult(false)} results={drawResults} pool={selectedPool} />
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
            <span className={`text-[10px] font-extrabold px-2 py-[2px] rounded-md m-1 bg-white/90 ${pz.textColor || 'text-[var(--color-primary)]'} border box-border ${pz.borderColor || 'border-transparent'} shadow-sm pointer-events-none drop-shadow-sm`}>
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

        <span className={`inline-block px-5 py-1.5 rounded-full bg-white/90 ${prize.textColor || 'text-gray-800'} font-black text-sm uppercase tracking-widest shadow-md mb-4 z-10 relative border-2 border-white/80 drop-shadow-sm`}>
          {prize.rarity} 品质详情
        </span>

        <div className={`relative w-64 h-80 rounded-2xl overflow-hidden shadow-xl mb-6 z-10 border border-gray-100 bg-white`}>
          <img src={prize.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>

        <h3 className="text-2xl font-extrabold text-gray-800 z-10 relative mb-1">{prize.name}</h3>
        <p className="text-gray-500 font-bold text-sm z-10 relative bg-gray-100 px-3 py-1 rounded-full drop-shadow-sm mt-3">
          在此卡池中抽取概率: <span className="text-[var(--color-primary)] text-lg px-1">{prize.rate}</span>
        </p>

      </motion.div>
    </motion.div>
  );
}

function ResultModal({ onClose, results, pool }: { onClose: () => void, results: any[], pool: any }) {
  const isMulti = results.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <Confetti />
      
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-6 flex flex-col items-center text-center shadow-2xl overflow-hidden glass border border-white/50 max-h-[90vh] overflow-y-auto [scrollbar-width:none]"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${pool.color} opacity-20`} />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/50 hover:bg-gray-200/50 text-gray-500 z-20 transition-colors"
        >
          <X size={20} />
        </button>

        {isMulti ? (
           <>
            <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-400 to-pink-500 text-white font-extrabold text-sm uppercase shadow-sm mb-4 z-10 relative">
              十连发结果
            </span>
            <div className="grid grid-cols-2 gap-3 w-full z-10">
              {results.map((prize, idx) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  key={idx} 
                  className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-1"
                >
                  <div className={`w-full aspect-[3/4] rounded-xl overflow-hidden shadow-sm relative bg-white border border-gray-50`}>
                     <img src={prize.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-[2px] rounded m-1 text-white bg-gradient-to-r ${prize.color} drop-shadow-sm`}>
                    {prize.rarity}
                  </span>
                  <span className="text-xs font-bold text-gray-800 truncate w-full">{prize.name}</span>
                </motion.div>
              ))}
            </div>
            <p className="text-xs font-bold text-orange-500 bg-orange-100 px-3 py-1 rounded-full my-4 inline-block z-10 relative">
              额外获得 3000 荧光棒！
            </p>
           </>
        ) : (
           <>
            <span className={`inline-block px-4 py-1.5 rounded-full bg-gradient-to-r ${results[0]?.color} text-white font-extrabold text-xs uppercase shadow-sm mb-4 z-10 relative`}>
              {results[0]?.rarity} 品质
            </span>

            <div className={`relative w-48 h-64 rounded-2xl overflow-hidden shadow-xl mb-6 z-10 border border-gray-100 bg-white`}>
               <img src={results[0]?.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            <h3 className="text-2xl font-extrabold text-gray-800 z-10 relative mb-2">{results[0]?.name}</h3>
            <p className="text-xs font-bold text-orange-500 bg-orange-100 px-3 py-1 rounded-full mb-3 inline-block z-10 relative">
              额外获得 300 荧光棒！
            </p>
           </>
        )}

        <p className="text-gray-500 font-medium text-sm z-10 relative">物品已放入背包</p>

        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.95 }}
          className="mt-6 w-full py-4 rounded-xl font-bold bg-white text-gray-800 shadow-md border border-gray-100 relative z-10 shrink-0"
        >
          太棒了！
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
