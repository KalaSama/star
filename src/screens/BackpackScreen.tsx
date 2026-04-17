import { motion } from 'motion/react';
import { Menu, PackageOpen, Share2 } from 'lucide-react';

interface BackpackScreenProps {
  key?: string;
  onMenuClick: () => void;
}

const INVENTORY = [
  { id: 1, name: '全息烫金小卡', type: 'Astrid ✨', rarity: 'SP 粉', image: 'https://picsum.photos/seed/prize_ssr/400/600', span: 'col-span-2 row-span-2', color: 'from-[#ff9eb5] to-[#ffb3c6]' },
  { id: 2, name: '限定亚克力立牌', type: 'Luna', rarity: 'SSR 红', image: 'https://picsum.photos/seed/p2/200/200', span: 'col-span-1 row-span-1', color: 'from-[#ff6b6b] to-[#ff8787]' },
  { id: 3, name: 'Q版应援徽章', type: 'Stella', rarity: 'SR 橙', image: 'https://picsum.photos/seed/p3/200/200', span: 'col-span-1 row-span-1', color: 'from-[#ffa94d] to-[#ffc078]' },
  { id: 4, name: '迷你演唱会玩偶', type: 'Astrid ✨', rarity: 'R 紫', image: 'https://picsum.photos/seed/p4/400/200', span: 'col-span-2 row-span-1', color: 'from-[#b197fc] to-[#d0bfff]' },
];

export default function BackpackScreen({ onMenuClick }: BackpackScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#FAFAFA] flex flex-col overflow-hidden"
    >
      {/* Floating Header - Unifies feel with Explore page */}
      <div className="absolute top-0 inset-x-0 z-20 pt-10 px-6 pb-6 flex justify-between items-center bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent pointer-events-none">
        <button
          onClick={onMenuClick}
          className="p-3 rounded-full glass bg-white/70 text-gray-800 shadow-sm hover:bg-white active:scale-95 transition-all pointer-events-auto border border-white backdrop-blur-md"
        >
          <Menu size={24} />
        </button>
        <span className="font-extrabold text-gray-800 text-lg tracking-widest drop-shadow-sm pointer-events-auto uppercase">我的背包</span>
        <div className="w-12 pointer-events-auto" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-28 pb-[200px]">
        {/* Bento Grid */}
        <div className="grid grid-cols-2 gap-4 auto-rows-[160px]">
          {INVENTORY.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-[2rem] overflow-hidden soft-shadow bg-white ${item.span} group border-2 border-white`}
            >
              <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              
              {/* Grading Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color} mix-blend-overlay opacity-50`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md glass bg-white/40 text-white text-[10px] uppercase font-extrabold shadow-sm backdrop-blur-md border border-white/40">
                {item.rarity}
              </div>

              {/* Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-extrabold text-lg leading-tight truncate drop-shadow-md">{item.name}</h3>
                <p className="text-[11px] font-bold text-white/90 truncate drop-shadow-md mt-1">{item.type}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Docked Action Area - Sits perfectly above BottomNav */}
      <div className="absolute bottom-0 inset-x-0 z-30 px-6 pt-24 pb-[100px] bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent pointer-events-none flex items-end">
        <div className="flex gap-4 w-full pointer-events-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gray-800 text-white rounded-2xl py-4 font-bold flex items-center justify-center gap-2 shadow-xl border border-gray-700"
          >
            <PackageOpen size={20} />
            申请发货 <span className="opacity-60 text-sm ml-1">(4)</span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-white text-gray-800 rounded-2xl py-4 font-bold flex items-center justify-center gap-2 soft-shadow border-2 border-white"
          >
            <Share2 size={20} />
            炫耀一下
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
