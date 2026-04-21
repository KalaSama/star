import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, MessageCircle, MapPin, Grid, Camera } from 'lucide-react';
import FanBadge from './FanBadge';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isFollowing: boolean;
  onToggleFollow: (id: string, current: boolean) => void;
}

export default function UserProfileModal({ isOpen, onClose, user, isFollowing, onToggleFollow }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState('posts');
  const [selectedPost, setSelectedPost] = useState<any>(null);
  
  // We need to store the previous user to allow exit animations to play gracefully
  // rather than immediately returning null when `user` prop becomes null.
  const [cachedUser, setCachedUser] = useState(user);

  if (user && user !== cachedUser) {
    setCachedUser(user);
  }

  const displayUser = user || cachedUser;

  return (
    <AnimatePresence>
      {isOpen && displayUser && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="absolute inset-0 z-[100] bg-white flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="absolute top-0 inset-x-0 z-20 pt-10 px-4 pb-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
            <button
              onClick={onClose}
              className="p-3 rounded-full glass bg-white/20 text-white hover:bg-white/30 active:scale-95 transition-all pointer-events-auto border border-white/20 backdrop-blur-md shadow-sm"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto w-full">
            {/* Banner */}
            <div className="h-48 w-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-cheer-orange)]">
              <img src="https://picsum.photos/seed/bg/800/400" className="w-full h-full object-cover mix-blend-overlay opacity-60" />
            </div>
            
            {/* Profile Info */}
            <div className="px-6 relative -mt-10 mb-6 flex flex-col items-start bg-white rounded-t-3xl pt-2">
               <div className="flex justify-between items-end w-full mb-3">
                 <img src={displayUser.avatar} className="w-20 h-20 rounded-full border-[4px] border-white shadow-md object-cover relative z-10" />
                 <button 
                    onClick={() => onToggleFollow(displayUser.id, isFollowing)}
                    className={`px-6 py-2 rounded-full font-extrabold text-sm border-2 transition-all active:scale-95 shadow-sm ${isFollowing ? 'bg-gray-100 text-gray-500 border-gray-100' : 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-[var(--color-primary)]/30'}`}
                  >
                    {isFollowing ? '已关注' : '+ 关注'}
                 </button>
               </div>
               
               <h2 className="text-2xl font-black text-gray-800 tracking-tight">{displayUser.name}</h2>
               <div className="flex items-center gap-2 mt-1 mb-2">
                 <div className="text-gray-500 text-xs font-bold leading-relaxed">分享生活的点滴时光 ✨</div>
               </div>
               
               {displayUser.badge && (
                  <div className="mt-1 mb-4 flex">
                    <FanBadge level={displayUser.badge.level} name={displayUser.badge.label} />
                  </div>
               )}
               
               <div className="flex gap-6 mt-2">
                 <div className="flex flex-col items-center"><span className="font-black text-lg text-gray-800">128</span><span className="text-xs text-gray-400 font-bold">关注</span></div>
                 <div className="flex flex-col items-center"><span className="font-black text-lg text-gray-800">4.5w</span><span className="text-xs text-gray-400 font-bold">粉丝</span></div>
                 <div className="flex flex-col items-center"><span className="font-black text-lg text-gray-800">12w</span><span className="text-xs text-gray-400 font-bold">获赞</span></div>
               </div>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-2 sticky top-0 bg-white/90 backdrop-blur-md z-10">
               <button onClick={() => setActiveTab('posts')} className={`flex-1 py-3 text-sm font-black transition-colors border-b-[3px] ${activeTab === 'posts' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400'}`}>动态</button>
               <button onClick={() => setActiveTab('likes')} className={`flex-1 py-3 text-sm font-black transition-colors border-b-[3px] ${activeTab === 'likes' ? 'border-gray-800 text-gray-800' : 'border-transparent text-gray-400'}`}>喜欢</button>
            </div>
            
            {/* Grid */}
            <div className="grid grid-cols-3 gap-0.5 mt-0.5">
               {[1,2,3,4,5,6].map(i => (
                 <button key={i} onClick={() => setSelectedPost(i)} className="aspect-[3/4] bg-gray-100 relative group overflow-hidden">
                   <img src={`https://picsum.photos/seed/userpost${i}/400/600`} className="w-full h-full object-cover group-active:scale-105 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"/>
                 </button>
               ))}
            </div>
          </div>
          
          {/* Selected Post Modal overlay placeholder (Simple full-image view for prototype) */}
          <AnimatePresence>
            {selectedPost && (
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-[110] bg-black flex flex-col">
                 <div className="absolute top-0 inset-x-0 pt-10 px-4 z-20 flex justify-between bg-gradient-to-b from-black/50 to-transparent">
                   <button onClick={() => setSelectedPost(null)} className="p-3 text-white"><X size={24}/></button>
                 </div>
                 <img src={`https://picsum.photos/seed/userpost${selectedPost}/400/600`} className="w-full h-full object-contain" />
                 <div className="absolute bottom-10 right-4 flex flex-col gap-4">
                    <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform text-white drop-shadow-md">
                      <div className="p-3 rounded-full bg-black/30 backdrop-blur-md mb-1 border border-white/10"><Heart size={28} className="text-white" /></div>
                      <span className="font-bold text-xs">{selectedPost * 123}</span>
                    </button>
                    <button className="flex flex-col items-center gap-1 active:scale-95 transition-transform text-white drop-shadow-md">
                      <div className="p-3 rounded-full bg-black/30 backdrop-blur-md mb-1 border border-white/10"><MessageCircle size={28} className="text-white"/></div>
                      <span className="font-bold text-xs">评论</span>
                    </button>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
