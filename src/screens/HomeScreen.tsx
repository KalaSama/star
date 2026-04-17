import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { Menu, Heart, Share2, Sparkles, Camera, X, Image as ImageIcon, Send } from 'lucide-react';

interface HomeScreenProps {
  key?: string;
  onMenuClick: () => void;
}

const FEED_ITEMS = [
  {
    id: 1,
    type: 'pull',
    image: 'https://picsum.photos/seed/gacha_pull/800/1200',
    name: '天呐！我抽到了隐藏款！！',
    desc: '花了好多荧光棒终于出了！Astrid 绝美 ✨ 简直是仙女本仙！',
    author: { name: '樱花海', avatar: 'https://picsum.photos/seed/u1/100/100' },
    pullName: '全息小卡 (SSR 粉色品质)'
  },
  {
    id: 2,
    type: 'official',
    image: 'https://picsum.photos/seed/idol1/800/1200',
    name: 'Astrid ✨',
    desc: '感谢昨晚超棒的演唱会！爱你们 💖 下周见面会不见不散哦~',
  },
  {
    id: 3,
    type: 'ugc',
    image: 'https://picsum.photos/seed/ugc2/800/1200',
    name: '新 Cosplay 进度',
    desc: '尽力还原了 Luna 在 MV 里的新打扮，道具还在努力制作中，期待最后的效果吧！',
    author: { name: 'MikuFan99', avatar: 'https://picsum.photos/seed/u2/100/100' }
  },
];

export default function HomeScreen({ onMenuClick }: HomeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);

  const handleDragEnd = (e: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.y < -swipeThreshold && currentIndex < FEED_ITEMS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (info.offset.y > swipeThreshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black"
    >
      {/* Top Header */}
      <div className="absolute top-0 inset-x-0 z-20 pt-10 px-6 pb-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
        <button
          onClick={onMenuClick}
          className="p-3 rounded-full glass bg-white/20 text-white hover:bg-white/30 active:scale-95 transition-all pointer-events-auto border border-white/20 backdrop-blur-md shadow-sm"
        >
          <Menu size={24} />
        </button>
        <span className="font-extrabold text-white text-lg tracking-widest drop-shadow-lg pointer-events-auto">发现</span>
        <div className="w-12 pointer-events-auto" />
      </div>

      {/* Swipeable Container - Full Height */}
      <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-900">
        <AnimatePresence initial={false} custom={currentIndex}>
          <motion.div
            key={currentIndex}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <FeedCard item={FEED_ITEMS[currentIndex]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Action Button for Posting */}
      <motion.button
        onClick={() => setIsComposing(true)}
        whileTap={{ scale: 0.9 }}
        className="absolute right-6 bottom-[110px] w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full shadow-2xl flex items-center justify-center text-white z-30 pointer-events-auto border-[3px] border-white/90"
        style={{ filter: "drop-shadow(0 10px 20px rgba(225,29,72,0.4))" }}
      >
        <Camera size={26} strokeWidth={2.5} className="mr-[1px]" />
      </motion.button>

      {/* Create Post Compose Modal */}
      <AnimatePresence>
        {isComposing && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-[#FAFAFA] z-50 flex flex-col"
          >
            <div className="pt-12 px-6 pb-4 bg-white flex justify-between items-center soft-shadow relative z-10 border-b border-gray-100">
              <button onClick={() => setIsComposing(false)} className="p-2 -ml-2 text-gray-500 rounded-full hover:bg-gray-100">
                <X size={24} />
              </button>
              <h2 className="font-extrabold text-lg text-gray-800 absolute left-1/2 -translate-x-1/2">发布动态</h2>
              <button 
                onClick={() => setIsComposing(false)} 
                className="bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] text-white px-5 py-2 rounded-full font-bold shadow-md flex items-center gap-1 active:scale-95 transition-transform"
              >
                发布 <Send size={14} className="ml-0.5"/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full flex flex-col p-6 gap-5 bg-gray-50">
              <div className="bg-white rounded-3xl p-5 soft-shadow border border-white flex flex-col gap-4">
                {/* Photo Placeholder */}
                <div className="w-full aspect-square bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <ImageIcon size={40} className="mb-2 text-gray-300" />
                  <span className="font-bold text-sm">点击上传照片或实况</span>
                </div>

                <input 
                  type="text" 
                  placeholder="填写一个吸引人的标题吧..." 
                  className="w-full text-xl font-extrabold text-gray-800 placeholder:text-gray-300 outline-none pt-2"
                />
                <hr className="w-full border-gray-100" />
                <textarea 
                  placeholder="说点什么... 晒单、分享欧气，或者倾注你对Ta的爱意吧 ✨" 
                  className="w-full h-32 text-gray-600 font-medium placeholder:text-gray-400 outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Tags / Addons */}
              <div className="flex gap-2 w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <button className="shrink-0 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-600 soft-shadow border border-gray-100"># 开箱</button>
                <button className="shrink-0 px-4 py-2 bg-white rounded-full text-xs font-bold text-gray-600 soft-shadow border border-gray-100"># 追星日记</button>
                <button className="shrink-0 px-4 py-2 bg-white rounded-full text-xs font-bold text-[var(--color-primary)] bg-pink-50 border border-pink-100 shadow-sm">+ 添加关联明星</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FeedCard({ item }: { item: any }) {
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <div className="relative w-full h-full pb-20"> {/* pb-20 ensures content slips behind bottom nav nicely */}
      <img
        src={item.image}
        alt="Feed Image"
        className="absolute w-full h-full object-cover pointer-events-none"
        referrerPolicy="no-referrer"
        draggable={false}
      />
      
      {/* Image Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

      {/* Top Tags */}
      {item.type === 'pull' && (
        <div className="absolute top-28 left-4 right-4 flex justify-center pointer-events-none">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="glass bg-white/20 px-5 py-2.5 rounded-full border border-yellow-300/50 flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <Sparkles className="text-yellow-300" size={20} fill="currentColor" />
            <span className="text-white font-extrabold text-sm drop-shadow-md pointer-events-auto">
              欧气爆棚：{item.pullName}
            </span>
          </motion.div>
        </div>
      )}

      {/* Bottom Content Area */}
      <div className="absolute bottom-[100px] left-4 right-[85px] flex flex-col justify-end pointer-events-none z-10">
        <div className="p-4 rounded-[1.5rem] glass-dark border border-white/10 bg-black/30 backdrop-blur-md">
          {/* UGC Author Tag */}
          {(item.type === 'ugc' || item.type === 'pull') && (
            <div className="flex items-center gap-2 mb-3 pointer-events-auto">
              <img src={item.author?.avatar} className="w-8 h-8 rounded-full border border-white/50 shadow-sm" alt="avatar" />
              <span className="text-white font-bold drop-shadow-md text-sm">{item.author?.name}</span>
            </div>
          )}

          <h3 className="text-[17px] font-black text-white mb-1.5 tracking-wide drop-shadow-md leading-tight pointer-events-auto">
            {item.name}
          </h3>
          <p className="text-white/90 text-xs leading-relaxed drop-shadow-sm font-medium line-clamp-3 pointer-events-auto">
            {item.desc}
          </p>
        </div>
      </div>

      {/* Right Side Action Buttons */}
      <div className="absolute right-4 bottom-[200px] flex flex-col gap-5 items-center z-20 pointer-events-auto">
        <ActionButton 
          icon={Heart} 
          label={liked ? "1.2w" : "1.2w"} 
          color={liked ? "text-pink-500" : "text-white"} 
          fill={liked ? "currentColor" : "none"} 
          onClick={handleLike} 
        />
        <ActionButton 
          icon={Share2} 
          label="分享" 
          color="text-white" 
          fill="none" 
          onClick={(e) => e.stopPropagation()} 
        />
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, color, fill, onClick }: { icon: any, label: string, color: string, fill: string, onClick: (e: any) => void }) {
  return (
    <div className="flex flex-col items-center gap-1 group">
      <motion.button 
        onClick={onClick}
        onPointerDown={(e) => e.stopPropagation()}
        whileTap={{ scale: 0.8 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center bg-black/20 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors shadow-lg`}
      >
        <Icon size={26} className={color} fill={fill} strokeWidth={2} />
      </motion.button>
      <span className="text-white text-[11px] font-bold drop-shadow-md tracking-wider">{label}</span>
    </div>
  );
}
