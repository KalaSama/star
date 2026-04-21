import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Trophy, CalendarCheck, Wand2, QrCode, Sparkles, UserSquare2, LogOut, FileText, ShieldCheck, Lock, ChevronRight, Award, Heart, Trash2, Crown, Check } from 'lucide-react';
import { ScreenState } from '../App';
import React, { useState } from 'react';
import FanBadge from './FanBadge';
import RewardModal from './RewardModal';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenState) => void;
  currentScreen: ScreenState;
  glowSticks: number;
}

export default function Drawer({ isOpen, onClose, onNavigate, currentScreen, glowSticks }: DrawerProps) {
  const [showWechatModal, setShowWechatModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAvatarSettingsModal, setShowAvatarSettingsModal] = useState(false);
  const [showNicknameModal, setShowNicknameModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  const [nickname, setNickname] = useState('星柚子');
  const [editNickname, setEditNickname] = useState('星柚子');
  const [hasPassword, setHasPassword] = useState(false);

  // Rewards Modal States
  const [rewardModalOpen, setRewardModalOpen] = useState(false);
  const [currentReward, setCurrentReward] = useState<{name: string, amount: number, icon: React.ReactNode} | null>(null);

  const AVATAR_FRAMES = [
    { id: 'default', name: '无边框', style: 'border-white', effect: null },
    { id: 'gold', name: '荣耀金钻', style: 'border-[#FCD34D] ring-2 ring-[#B45309]', effect: 'bg-gradient-to-tr from-yellow-300 to-yellow-600 p-1' }
  ];
  const [activeFrameId, setActiveFrameId] = useState('gold');
  const activeFrame = AVATAR_FRAMES.find(f => f.id === activeFrameId) || AVATAR_FRAMES[0];

  // Mock post state
  const [myPosts, setMyPosts] = useState([
    { id: 1, likes: 230, claimed: false },
    { id: 2, likes: 1400, claimed: true },
    { id: 3, likes: 900, claimed: false }
  ]);
  const totalLikes = myPosts.reduce((acc, curr) => acc + curr.likes, 0);

  const [rewards, setRewards] = useState([
    { threshold: 100, reward: 50, claimed: true },
    { threshold: 1000, reward: 300, claimed: false },
    { threshold: 2500, reward: 1000, claimed: false },
  ]);

  const nextRewardIndex = rewards.findIndex(r => !r.claimed);
  const nextReward = nextRewardIndex !== -1 ? rewards[nextRewardIndex] : null;

  const handleClaimReward = (idx: number, rewardAmount: number) => {
    setCurrentReward({ name: "星光棒", amount: rewardAmount, icon: <Wand2 size={24} /> });
    setRewardModalOpen(true);
    const newR = [...rewards];
    newR[idx].claimed = true;
    setRewards(newR);
  };

  const FAN_BADGES = [
    { id: 'none', label: '无佩戴', level: 0 },
    { id: 'astrid', label: 'A粉', level: 5 },
    { id: 'luna', label: '月光', level: 3 },
    { id: 'stella', label: '星星', level: 2 },
  ];

  const [activeBadgeId, setActiveBadgeId] = useState('astrid');
  const [showFanBadgeModal, setShowFanBadgeModal] = useState(false);
  const activeBadge = FAN_BADGES.find(b => b.id === activeBadgeId);

  const handleDeletePost = (id: number) => {
    if(confirm('确定删除这条动态吗？')) {
      setMyPosts(myPosts.filter(p => p.id !== id));
    }
  };

  const menuItems = [
    { id: 'ranking', label: '星光榜', icon: Trophy, bg: 'bg-orange-50', color: 'text-orange-500' },
    { id: 'checkin', label: '每日签到', icon: CalendarCheck, bg: 'bg-pink-50', color: 'text-[var(--color-primary)]' },
  ] as const;

  return (
    <>
      <RewardModal 
        isOpen={rewardModalOpen} 
        onClose={() => setRewardModalOpen(false)} 
        rewards={currentReward ? [currentReward] : []} 
      />
      <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer styling */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-[#FAFAFA] shadow-2xl flex flex-col pt-12 pb-6"
          >
            <button
               onClick={onClose}
               className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95 transition-all"
             >
               <X size={20} />
             </button>
 
             {/* Profile Area */}
             <div className="px-6 mb-10 flex flex-col items-center group relative">
               <button className="rounded-full shadow-xl overflow-hidden mb-3 active:scale-95 transition-transform">
                 <img src="https://picsum.photos/seed/user1/200/200" alt="User" className="w-20 h-20 object-cover rounded-full border-2 border-white" />
               </button>
               <button onClick={() => setShowNicknameModal(true)} className="flex items-center gap-1.5 justify-center active:scale-95 transition-transform hover:opacity-80">
                 <h2 className="text-xl font-extrabold text-gray-800">{nickname}</h2>
               </button>
               {activeBadge && activeBadge.id !== 'none' ? (
                 <button onClick={() => setShowFanBadgeModal(true)} className="mt-1.5 active:scale-95 transition-transform">
                   <FanBadge level={activeBadge.level} name={activeBadge.label} />
                 </button>
               ) : (
                 <button onClick={() => setShowFanBadgeModal(true)} className="mt-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-gray-400 bg-gray-100 flex items-center gap-1 hover:bg-gray-200">
                   佩戴粉丝徽章
                 </button>
               )}
               <button onClick={() => window.dispatchEvent(new CustomEvent('SHOW_GLOW_STICKS'))} className="flex items-center gap-1.5 mt-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100 active:scale-95 transition-transform hover:bg-gray-50">
                 <Wand2 size={16} className="text-[var(--color-primary)]" />
                 <span className="font-extrabold text-sm text-[var(--color-primary)]">{glowSticks} <span className="text-gray-400 font-medium ml-1">棒</span></span>
               </button>
             </div>
 
             <nav className="flex flex-col gap-3 px-4 flex-1 overflow-y-auto [scrollbar-width:none]">
               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-1">功能区</div>
               
               <button
                 onClick={() => setShowProfileModal(true)}
                 className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 hover:bg-white font-medium group active:scale-[0.98]"
               >
                 <div className="p-2 rounded-xl bg-blue-50">
                   <UserSquare2 size={20} className="text-blue-500" />
                 </div>
                 <span className="text-lg text-gray-600">我的主页</span>
               </button>
 
               {menuItems.map((item) => {
                 const Icon = item.icon;
                 const isActive = currentScreen === item.id;
                 return (
                   <button
                     key={item.id}
                     onClick={() => onNavigate(item.id)}
                     className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 ${
                       isActive
                         ? 'bg-white shadow-sm font-bold border border-gray-100'
                         : 'hover:bg-white font-medium active:scale-[0.98]'
                     }`}
                   >
                     <div className={`p-2 rounded-xl ${item.bg}`}>
                       <Icon size={20} className={item.color} />
                     </div>
                     <span className={`text-lg ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>{item.label}</span>
                   </button>
                 );
               })}
               
               <div className="mt-4 border-t border-gray-100 pt-4 text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-1">系统与偏好</div>
               <button
                 onClick={() => setShowSettingsModal(true)}
                 className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 hover:bg-white font-medium group active:scale-[0.98]"
               >
                 <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                   <Settings size={20} className="text-gray-500" />
                 </div>
                 <span className="text-lg text-gray-600">设置</span>
               </button>
             </nav>
 
             <div className="mt-auto px-6">
               <div className="p-5 rounded-[2rem] bg-gradient-to-br from-[#FFB7B2]/40 to-white text-sm text-gray-600 flex flex-col gap-2 relative overflow-hidden soft-shadow border border-pink-100/50">
                 <Sparkles size={50} className="absolute -bottom-2 -right-2 text-pink-500/10" />
                 <p className="font-extrabold text-gray-800 text-lg">星光耀应援总会</p>
                 <p className="z-10 font-bold leading-relaxed shadow-sm p-2 bg-white/40 rounded-xl">获取每日额外应援棒补给，领取专属纪念绝版称号与头像框！</p>
                 <button 
                   onClick={() => setShowWechatModal(true)}
                   className="mt-2 w-full py-3 bg-white rounded-xl font-bold text-[var(--color-primary)] shadow-sm z-10 transition-transform active:scale-95 border border-pink-50"
                 >
                   领取专属特权
                 </button>
               </div>
             </div>
           </motion.div>
           
           {/* Avatar Setting Modal */}
           <AnimatePresence>
             {showAvatarSettingsModal && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[70] flex flex-col bg-[#FAFAFA]"
               >
                 <div className="bg-white/80 glass px-6 pt-10 pb-4 flex justify-between items-center border-b border-gray-100">
                   <h2 className="text-xl font-extrabold text-gray-800">个性化装扮</h2>
                  <button onClick={() => setShowAvatarSettingsModal(false)} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <X size={20} />
                  </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto w-full px-4 pt-6">
                    <div className="flex flex-col items-center justify-center bg-white rounded-3xl p-6 shadow-sm border border-gray-50 mb-6 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5"><Crown size={120} /></div>
                       <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 z-10">预览效果</p>
                       <div className={`rounded-full shadow-xl overflow-hidden z-10 transition-all ${activeFrame.effect || ''}`}>
                         <img src="https://picsum.photos/seed/user1/200/200" className={`w-28 h-28 object-cover rounded-full border-4 ${activeFrame.style}`} />
                       </div>
                       <h3 className="text-lg font-extrabold text-gray-800 mt-4 z-10">{activeFrame.name}</h3>
                    </div>
                    
                    <h3 className="font-extrabold text-gray-800 px-2 mb-3">头像框选择 ({AVATAR_FRAMES.length})</h3>
                    <div className="grid grid-cols-2 gap-3 pb-20">
                      {AVATAR_FRAMES.map(frame => (
                        <button 
                          key={frame.id}
                          onClick={() => setActiveFrameId(frame.id)}
                          className={`relative p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${activeFrameId === frame.id ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]' : 'bg-white border-gray-100 shadow-sm opacity-80 hover:opacity-100'}`}
                        >
                          {activeFrameId === frame.id && <div className="absolute top-2 right-2 p-1 bg-[var(--color-primary)] text-white rounded-full"><Check size={12} /></div>}
                          <div className={`rounded-full shadow-sm overflow-hidden ${frame.effect || ''}`}>
                            <img src="https://picsum.photos/seed/user1/200/200" className={`w-14 h-14 object-cover rounded-full border-2 ${frame.style}`} />
                          </div>
                          <span className="font-bold text-sm text-gray-700">{frame.name}</span>
                        </button>
                      ))}
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
 
           {/* Fan Badge Modal */}
           <AnimatePresence>
             {showFanBadgeModal && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
                 onClick={() => setShowFanBadgeModal(false)}
               >
                 <motion.div
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.9, opacity: 0 }}
                   onClick={(e) => e.stopPropagation()}
                   className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 flex flex-col relative shadow-2xl"
                 >
                   <button onClick={() => setShowFanBadgeModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                     <X size={20} />
                   </button>
                   <h3 className="text-xl font-extrabold text-gray-800 tracking-tight mb-2">我的粉丝徽章</h3>
                   <p className="text-xs text-gray-400 font-bold mb-6">为喜爱的明星应援可提升徽章等级</p>
                   
                   <div className="flex flex-col gap-3">
                     {FAN_BADGES.map(badge => (
                       <button 
                         key={badge.id}
                         onClick={() => setActiveBadgeId(badge.id)}
                         className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${activeBadgeId === badge.id ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'border-gray-100 bg-white hover:bg-gray-50'}`}
                       >
                         <div className="flex items-center gap-3">
                           {badge.id !== 'none' ? (
                             <FanBadge level={badge.level} name={badge.label} />
                           ) : (
                             <div className="px-3 py-1 rounded-full text-xs font-bold text-gray-500 bg-gray-100">
                               {badge.label}
                             </div>
                           )}
                         </div>
                         {activeBadgeId === badge.id && <Check size={18} className="text-[var(--color-primary)]" />}
                       </button>
                     ))}
                   </div>
                 </motion.div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Profile Modal */}
           <AnimatePresence>
             {showProfileModal && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[70] flex flex-col bg-[#FAFAFA]"
               >
                 <div className="bg-white/80 glass px-6 pt-10 pb-4 flex justify-between items-center border-b border-gray-100">
                   <h2 className="text-xl font-extrabold text-gray-800">我的主页</h2>
                  <button onClick={() => setShowProfileModal(false)} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <X size={20} />
                  </button>
                 </div>
 
                 <div className="flex-1 overflow-y-auto w-full">
                    {/* Profile Header */}
                    <div className="flex flex-col items-center gap-2 px-6 pt-8 pb-6 bg-white shrink-0 shadow-sm border-b border-gray-50 mb-4">
                      
                      <div className="rounded-full shadow-md overflow-hidden">
                        <img src="https://picsum.photos/seed/user1/200/200" className="w-16 h-16 object-cover rounded-full border-2 border-white" />
                      </div>
                      <span className="font-extrabold text-xl text-gray-800 tracking-tight mt-1">{nickname}</span>
                      
                      {/* Stacked Reward System */}
                      <div className="w-full mt-4 bg-gradient-to-br from-pink-50/50 to-orange-50/50 rounded-[2rem] p-5 border border-pink-100/50 shadow-sm relative overflow-hidden">
                        <Sparkles size={60} className="absolute -top-4 -right-4 text-pink-500/5" />
                        <div className="flex justify-between items-end mb-4 relative z-10">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-1">人气里程碑</span>
                             <span className="text-3xl font-black text-gray-800 leading-none">{totalLikes} <span className="text-sm font-bold text-gray-500">点赞</span></span>
                          </div>
                          <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
                            <Heart size={20} className="text-pink-400" fill="currentColor" />
                          </div>
                        </div>
                        
                        <div className="relative z-10 flex flex-col pt-2 border-t border-pink-100/50">
                          {nextReward ? (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-extrabold text-gray-800">目标：{nextReward.threshold} 赞</span>
                                <span className="text-sm font-black text-[var(--color-primary)]">{totalLikes} / {nextReward.threshold}</span>
                              </div>
                              <div className="w-full h-2 bg-pink-100/50 rounded-full overflow-hidden mb-1">
                                <div className="h-full bg-gradient-to-r from-pink-400 to-orange-400" style={{ width: `${Math.min(100, (totalLikes / nextReward.threshold) * 100)}%` }} />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">奖励：{nextReward.reward} <Wand2 size={12}/></span>
                                <button 
                                  disabled={totalLikes < nextReward.threshold}
                                  onClick={() => handleClaimReward(nextRewardIndex, nextReward.reward)}
                                  className={`px-5 py-2.5 rounded-full text-xs font-black transition-all ${totalLikes >= nextReward.threshold ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] text-white shadow-lg active:scale-95' : 'bg-white/60 text-gray-400 cursor-not-allowed'}`}
                                >
                                  {totalLikes >= nextReward.threshold ? '领取奖励' : '未达成'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-green-500 font-extrabold text-sm justify-center py-2">
                              <Check size={18} /> 已完成所有当前里程碑！
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
 
                    <div className="px-6 pb-2 font-extrabold text-gray-800 flex items-center justify-between mt-2">
                      我的发布 ({myPosts.length})
                    </div>
 
                    {/* Posts Grid */}
                    <div className="px-6 mt-2 grid grid-cols-2 gap-3 pb-20">
                      {myPosts.map(p => (
                        <div key={p.id} className="rounded-2xl overflow-hidden shadow-sm relative group bg-white border border-gray-100 flex flex-col">
                          <img src={`https://picsum.photos/seed/post${p.id}/300/400`} className="w-full aspect-[3/4] object-cover" />
                          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex justify-between items-end">
                            <div className="flex items-center gap-1 text-white text-[11px] font-bold">
                              <Heart size={14} fill="white" className="text-white" /> {p.likes}
                            </div>
                            <button 
                              onClick={() => handleDeletePost(p.id)}
                              className="text-white/80 hover:text-red-400 transition-colors p-1"
                            >
                               <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
 
           {/* Settings Modal */}
           <AnimatePresence>
             {showSettingsModal && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[70] flex flex-col bg-[#FAFAFA]"
               >
                 <div className="bg-white/80 glass px-6 pt-10 pb-4 flex justify-between items-center border-b border-gray-100">
                   <h2 className="text-xl font-extrabold text-gray-800">系统设置</h2>
                  <button onClick={() => setShowSettingsModal(false)} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
                    <X size={20} />
                  </button>
                 </div>
 
                 <div className="flex-1 overflow-y-auto w-full px-4 pt-6 pb-20 flex flex-col gap-5">
                    
                    <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase pl-4">账户安全</h3>
                    <div className="bg-white rounded-[2rem] p-4 flex flex-col shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between p-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left group">
                        <div className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="p-2 bg-gray-100 text-gray-500 rounded-lg group-hover:bg-white"><ShieldCheck size={18} /></div>
                          绑定的手机
                        </div>
                        <span className="text-sm font-bold text-gray-400">138****0000</span>
                      </div>
                      <div className="w-full h-px bg-gray-50" />
                      <button onClick={() => setShowPasswordModal(true)} className="flex items-center justify-between p-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group">
                        <div className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white"><Lock size={18} className="text-gray-500" /></div>
                          设置登录密码
                        </div>
                        <div className="flex items-center gap-2">
                           <span className={`text-sm font-bold ${hasPassword ? 'text-green-500' : 'text-gray-400'}`}>
                             {hasPassword ? '已设置' : '未设置'}
                           </span>
                           <ChevronRight size={18} className="text-gray-300" />
                        </div>
                      </button>
                    </div>

                    <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase pl-4 mt-2">关于我们</h3>
                    <div className="bg-white rounded-[2rem] p-4 flex flex-col shadow-sm border border-gray-100">
                      <button className="flex items-center justify-between p-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group">
                        <div className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white"><FileText size={18} className="text-gray-500" /></div>
                          隐私协议
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                      </button>
                      <div className="w-full h-px bg-gray-50" />
                      <button className="flex items-center justify-between p-4 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors text-left group">
                        <div className="flex items-center gap-3 text-gray-700 font-bold">
                          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white"><FileText size={18} className="text-gray-500" /></div>
                          用户服务协议
                        </div>
                        <ChevronRight size={18} className="text-gray-300" />
                      </button>
                    </div>
 
                    <button className="w-full py-4 text-red-500 font-extrabold bg-white shadow-sm border border-red-100 rounded-[2rem] active:scale-95 transition-transform flex items-center justify-center gap-2 mt-4">
                      <LogOut size={18} /> 退出登录
                    </button>
                    
                    <div className="mt-auto pt-10 text-center font-bold text-[10px] text-gray-400 tracking-wider">
                      京ICP备202029302号-1 <br/> 星光耀互动娱乐 v2.1.0
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Nickname Modal */}
           <AnimatePresence>
             {showNicknameModal && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
                 onClick={() => setShowNicknameModal(false)}
               >
                 <motion.div
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.9, opacity: 0 }}
                   onClick={(e) => e.stopPropagation()}
                   className="bg-white rounded-[2.5rem] w-full max-w-xs p-8 flex flex-col relative shadow-2xl"
                 >
                   <button onClick={() => setShowNicknameModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                     <X size={20} />
                   </button>
                   <h3 className="text-xl font-extrabold text-gray-800 tracking-tight mb-4">修改昵称</h3>
                   
                   <input 
                     type="text" 
                     value={editNickname}
                     onChange={(e) => setEditNickname(e.target.value)}
                     className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all mb-6"
                     placeholder="输入新昵称"
                   />
                   
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     onClick={() => {
                       if(editNickname.trim()) setNickname(editNickname.trim());
                       setShowNicknameModal(false);
                     }}
                     className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-extrabold shadow-lg"
                   >
                     保存修改
                   </motion.button>
                 </motion.div>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Password Setup Modal */}
           <AnimatePresence>
             {showPasswordModal && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
                 onClick={() => setShowPasswordModal(false)}
               >
                 <motion.div
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.9, opacity: 0 }}
                   onClick={(e) => e.stopPropagation()}
                   className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 flex flex-col relative shadow-2xl"
                 >
                   <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
                     <X size={20} />
                   </button>
                   <h3 className="text-xl font-extrabold text-gray-800 tracking-tight mb-2">安全验证</h3>
                   <p className="text-xs text-gray-500 font-bold mb-6">为保证账号安全，请先进行手机号验证。</p>
                   
                   <div className="flex flex-col gap-4 mb-6">
                     <div className="flex gap-2">
                       <input 
                         type="text"
                         readOnly
                         value="138****0000"
                         className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-500 focus:outline-none"
                       />
                       <button className="px-4 bg-orange-50 text-orange-500 font-bold text-xs rounded-2xl border border-orange-100 hover:bg-orange-100 active:scale-95 transition-all w-[100px]">
                         获取验证码
                       </button>
                     </div>
                     <input 
                       type="text" 
                       placeholder="请输入受到的短信验证码"
                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                     />
                     <div className="h-px w-full bg-gray-100 my-1" />
                     <input 
                       type="password" 
                       placeholder="设置新密码 (至少6位)"
                       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 transition-all"
                     />
                   </div>
                   
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     onClick={() => {
                       setHasPassword(true);
                       setShowPasswordModal(false);
                       alert('密码设置成功！');
                     }}
                     className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] text-white font-extrabold shadow-lg"
                   >
                     完成设置
                   </motion.button>
                 </motion.div>
               </motion.div>
             )}
           </AnimatePresence>
 
           {/* WeChat QR Modal */}
           <AnimatePresence>
             {showWechatModal && (
               <motion.div
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
                 onClick={() => setShowWechatModal(false)}
               >
                 <motion.div
                   initial={{ scale: 0.9, y: 20 }}
                   animate={{ scale: 1, y: 0 }}
                   exit={{ scale: 0.9, opacity: 0 }}
                   onClick={(e) => e.stopPropagation()}
                   className="bg-white rounded-[2.5rem] w-full max-w-sm p-8 flex flex-col items-center relative overflow-hidden shadow-2xl border-2 border-white/80"
                 >
                   <button
                     onClick={() => setShowWechatModal(false)}
                     className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                   >
                     <X size={20} />
                   </button>
                   <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-[var(--color-primary)] mb-4 border border-pink-100 shadow-inner">
                     <QrCode size={30} />
                   </div>
                   <h3 className="text-xl font-extrabold text-gray-800 tracking-tight mb-2">解锁总会专属福利</h3>
                   <p className="text-sm font-bold text-gray-500 text-center mb-6">长按保存或扫描下方二维码，加入星光耀应援总会，立刻领取 500 应援棒及专属头像框初见礼包！</p>
                   
                   <div className="w-48 h-48 border-[4px] border-gray-100/50 rounded-3xl p-3 bg-gray-50 flex items-center justify-center mb-6 shadow-sm overflow-hidden relative">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ExampleWechatQR" alt="QR Code" className="w-full h-full object-contain mix-blend-multiply opacity-90" />
                      <div className="absolute inset-0 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] rounded-[1.25rem] pointer-events-none" />
                   </div>
                   
                   <motion.button 
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setShowWechatModal(false)} 
                     className="w-full py-4 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] text-white font-extrabold shadow-xl border border-white/50"
                   >
                     保存二维码 
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
    );
  }
