import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo, Reorder } from 'motion/react';
import { Menu, Heart, Share2, Sparkles, Camera, X, Image as ImageIcon, Send, UserPlus, UserCheck } from 'lucide-react';
import FanBadge from '../components/FanBadge';
import UserProfileModal from '../components/UserProfileModal';

interface HomeScreenProps {
  key?: string;
  onMenuClick: () => void;
}

const FEED_ITEMS = [
  {
    id: 1,
    type: 'pull',
    image: 'https://picsum.photos/seed/home1/800/1200',
    name: '天呐！我抽到了隐藏款！！',
    desc: '花了好多荧光棒终于出了！Astrid 绝美 ✨ 简直是仙女本仙！',
    author: { 
      id: "u1",
      name: '樱花海', 
      avatar: 'https://picsum.photos/seed/user1/100/100',
      badge: { label: 'A粉', level: 5 },
      isFollowing: false,
    },
    pullName: '全息小卡 (SSR 粉色品质)'
  },
  {
    id: 2,
    type: 'official',
    image: 'https://picsum.photos/seed/home2/800/1200',
    name: 'Astrid ✨',
    desc: '感谢昨晚超棒的演唱会！爱你们 💖 下周见面会不见不散哦~',
  },
  {
    id: 3,
    type: 'ugc',
    image: 'https://picsum.photos/seed/home3/800/1200',
    name: '新 Cosplay 进度',
    desc: '尽力还原了 Luna 在 MV 里的新打扮，道具还在努力制作中，期待最后的效果吧！',
    author: { 
      id: "u2",
      name: 'MikuFan99', 
      avatar: 'https://picsum.photos/seed/user3/100/100',
      badge: { label: '月光', level: 3 },
      isFollowing: true,
    }
  },
];

export default function HomeScreen({ onMenuClick }: HomeScreenProps) {
  const [feedMode, setFeedMode] = useState<'discover' | 'following'>('discover');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // A localized follow state just for demonstration
  const [followingMap, setFollowingMap] = useState<{[key: string]: boolean}>({
    "u2": true
  });

  const handleToggleFollow = (userId: string, current: boolean) => {
    setFollowingMap(prev => ({ ...prev, [userId]: !current }));
  };

  const currentFeed = feedMode === 'discover' 
    ? FEED_ITEMS 
    : FEED_ITEMS.filter(item => item.author?.id && followingMap[item.author.id]);

  const handleCreatePost = () => {
    setIsComposing(false);
    setUploadedImages([]);
  };

  const handleAddImage = () => {
    setUploadedImages([...uploadedImages, `https://picsum.photos/seed/upld${Date.now()}/400/400`]);
  };

  const handleRemoveImage = (img: string) => {
    setUploadedImages(uploadedImages.filter(i => i !== img));
  };

  const handleDragEnd = (e: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.y < -swipeThreshold && currentIndex < currentFeed.length - 1) {
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
        <div className="flex items-center gap-6 pointer-events-auto">
          <button 
            onClick={() => { setFeedMode('discover'); setCurrentIndex(0); }}
            className={`font-extrabold text-lg transition-all ${feedMode === 'discover' ? 'text-white tracking-widest drop-shadow-md' : 'text-white/60 tracking-wider scale-90'}`}
          >
            发现
          </button>
          <div className="w-[1px] h-4 bg-white/30 rounded-full" />
          <button 
            onClick={() => { setFeedMode('following'); setCurrentIndex(0); }}
            className={`font-extrabold text-lg transition-all ${feedMode === 'following' ? 'text-white tracking-widest drop-shadow-md' : 'text-white/60 tracking-wider scale-90'}`}
          >
            关注
          </button>
        </div>
        <div className="w-12 pointer-events-auto" />
      </div>

      {/* Swipeable Container - Full Height */}
      <div className="relative w-full h-[100dvh] overflow-hidden bg-gray-900">
        <AnimatePresence initial={false} custom={currentIndex}>
          {currentFeed.length > 0 ? (
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
              <FeedCard 
                item={currentFeed[currentIndex]} 
                setIsComposing={setIsComposing} 
                followingMap={followingMap}
                onToggleFollow={handleToggleFollow}
                onUserClick={setSelectedUser}
              />
            </motion.div>
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                <Heart size={40} className="mb-3 opacity-50" />
                <p className="font-bold text-sm">还没有关注任何人哦</p>
             </div>
          )}
        </AnimatePresence>
      </div>

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
                onClick={handleCreatePost} 
                className="bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] text-white px-5 py-2 rounded-full font-bold shadow-md flex items-center gap-1 active:scale-95 transition-transform"
              >
                发布 <Send size={14} className="ml-0.5"/>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto w-full flex flex-col p-6 gap-5 bg-gray-50">
              <div className="bg-white rounded-3xl w-full p-4 soft-shadow border border-gray-50 flex flex-col gap-4">
                {/* Image Upload Area */}
                <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] py-2 px-1">
                  <Reorder.Group axis="x" values={uploadedImages} onReorder={setUploadedImages} className="flex gap-3">
                    {uploadedImages.map((img) => (
                      <Reorder.Item key={img} value={img} className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden shadow-sm touch-none">
                        <img src={img} className="w-full h-full object-cover pointer-events-none" />
                        <button 
                          onPointerDown={(e) => e.stopPropagation()} 
                          onClick={() => handleRemoveImage(img)}
                          className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full backdrop-blur-sm"
                        >
                          <X size={12} />
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                  <button 
                    onClick={handleAddImage}
                    className="shrink-0 w-24 h-24 bg-gray-50 rounded-2xl flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 active:bg-gray-100 transition-colors"
                  >
                    <ImageIcon size={24} className="mb-1 text-gray-300" />
                    <span className="font-bold text-[10px]">添加照片</span>
                  </button>
                </div>
                
                <input 
                  type="text" 
                  placeholder="填写一个吸引人的标题吧..." 
                  className="w-full text-lg font-extrabold text-gray-800 placeholder:text-gray-300 outline-none px-2"
                />
                <hr className="w-full border-gray-50" />
                <textarea 
                  placeholder="说点什么... 晒单、分享欧气，或者倾注你对Ta的爱意吧 ✨" 
                  className="w-full h-32 text-gray-600 font-medium placeholder:text-gray-400 outline-none resize-none leading-relaxed px-2"
                />
              </div>

              {/* Addons */}
              <div className="flex gap-2 w-full overflow-x-auto [scrollbar-width:none]">
                <button className="shrink-0 px-4 py-2 bg-white rounded-full text-xs font-bold text-[var(--color-primary)] bg-pink-50 border border-pink-100 shadow-sm">+ 添加关联明星</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <UserProfileModal 
        isOpen={!!selectedUser} 
        onClose={() => setSelectedUser(null)} 
        user={selectedUser} 
        isFollowing={selectedUser ? followingMap[selectedUser.id] : false} 
        onToggleFollow={handleToggleFollow} 
      />
    </motion.div>
  );
}

function FeedCard({ 
  item, 
  setIsComposing, 
  followingMap, 
  onToggleFollow,
  onUserClick
}: { 
  item: any, 
  setIsComposing: (val: boolean) => void,
  followingMap: {[key: string]: boolean},
  onToggleFollow: (id: string, current: boolean) => void,
  onUserClick: (user: any) => void
}) {
  const [liked, setLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <div className="relative w-full h-full pb-20 bg-black overflow-hidden"> {/* pb-20 ensures content slips behind bottom nav nicely */}
      {/* Blurred Background to make letterboxing look premium like TikTok */}
      <img 
        src={item.image} 
        className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none" 
        alt="" 
      />
      
      <img
        src={item.image}
        alt="Feed Image"
        className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0"
        referrerPolicy="no-referrer"
        draggable={false}
      />
      
      {/* Image Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-0" />

      {/* Bottom Content Area */}
      <div className="absolute bottom-[100px] left-4 right-[85px] flex flex-col justify-end pointer-events-none z-10">
        <div className="p-4 rounded-[1.5rem] glass-dark border border-white/10 bg-black/30 backdrop-blur-md">
          {/* UGC Author Tag */}
          {(item.type === 'ugc' || item.type === 'pull') && (
            <div className="flex items-center gap-2 mb-3 pointer-events-auto">
              <button className="flex-shrink-0 active:scale-95 transition-transform" onClick={(e) => { e.stopPropagation(); onUserClick(item.author); }}>
                <img src={item.author?.avatar} className="w-9 h-9 rounded-full shadow-sm object-cover border-[1.5px] border-white/50" alt="avatar" />
              </button>
              <div className="flex flex-col gap-0.5 pointer-events-auto">
                <div className="flex items-center gap-2">
                  <button className="text-white font-extrabold drop-shadow-md text-sm hover:underline" onClick={(e) => { e.stopPropagation(); onUserClick(item.author); }}>{item.author?.name}</button>
                  {item.author?.id && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); onToggleFollow(item.author.id, followingMap[item.author.id]); }}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors flex items-center gap-0.5 ${followingMap[item.author.id] ? 'bg-white/20 border-white/10 text-white/80' : 'bg-[var(--color-primary)] border-[var(--color-primary-light)] text-white shadow-sm'}`}
                    >
                      {followingMap[item.author.id] ? (
                        <><UserCheck size={10} /> 已关注</>
                      ) : (
                        <><UserPlus size={10} /> 关注</>
                      )}
                    </button>
                  )}
                </div>
                {item.author?.badge && (
                  <FanBadge level={item.author.badge.level} name={item.author.badge.label} />
                )}
              </div>
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
      <div className="absolute right-4 bottom-[120px] flex flex-col gap-5 items-center z-20 pointer-events-auto">
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
        <div className="flex flex-col items-center gap-1 group">
           <motion.button 
             onClick={() => setIsComposing(true)}
             onPointerDown={(e) => e.stopPropagation()}
             whileTap={{ scale: 0.8 }}
             className={`w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-primary-light)] backdrop-blur-md border border-[var(--color-primary)] transition-colors shadow-lg shadow-[var(--color-primary-light)]/40`}
           >
             <Camera size={26} className="text-white" strokeWidth={2} />
           </motion.button>
           <span className="text-white text-[11px] font-bold drop-shadow-md tracking-wider">发布</span>
        </div>
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
