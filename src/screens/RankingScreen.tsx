import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Flame, Trophy, Wand2, Search, Heart, ChevronDown, Check, Medal, Crown, X } from 'lucide-react';
import React, { useState, useMemo } from 'react';

interface RankingScreenProps {
  key?: string;
  onBack: () => void;
  glowSticks: number;
  setGlowSticks: (n: number) => void;
}

// Complex mocked rewards data
const MOCK_REWARDS = {
  digital: { icon: '🖼️', tag: '专属气泡', bg: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
  avatarLabel: { icon: '👑', tag: '动态称号', bg: 'bg-yellow-50 border-yellow-100 text-yellow-600' },
  physical: { icon: '🎁', tag: '实物周边', bg: 'bg-pink-50 border-pink-100 text-pink-600' },
  audio: { icon: '🎧', tag: '私区语音', bg: 'bg-emerald-50 border-emerald-100 text-emerald-600' }
};

// Mock Data for Idols with global and weekly heat
const INITIAL_STARS = [
  { id: 1, name: 'Astrid ✨', isFollowed: true, myLevel: 5, myExp: 350, maxExp: 500, globalHeat: 582400, weeklyHeat: 82000, reward: { ...MOCK_REWARDS.avatarLabel, desc: 'Astrid星光守护者 动态称号' }, avatar: 'https://picsum.photos/seed/idol1/100/100', bg: 'bg-yellow-50' },
  { id: 2, name: 'Luna / ルナ', isFollowed: false, myLevel: 3, myExp: 100, maxExp: 300, globalHeat: 495120, weeklyHeat: 91000, reward: { ...MOCK_REWARDS.physical, desc: '精美立牌抽奖券' }, avatar: 'https://picsum.photos/seed/idol2/100/100', bg: 'bg-gray-50' },
  { id: 3, name: 'Stella', isFollowed: true, myLevel: 2, myExp: 220, maxExp: 250, globalHeat: 412000, weeklyHeat: 56000, reward: { ...MOCK_REWARDS.digital, desc: '星星魔法聊天气泡' }, avatar: 'https://picsum.photos/seed/idol3/100/100', bg: 'bg-orange-50' },
  { id: 4, name: 'Neon', isFollowed: false, myLevel: 1, myExp: 20, maxExp: 100, globalHeat: 320500, weeklyHeat: 43000, reward: { ...MOCK_REWARDS.audio, desc: '睡前悄悄话音频' }, avatar: 'https://picsum.photos/seed/idol4/100/100', bg: 'bg-white' },
  { id: 5, name: 'Nova', isFollowed: true, myLevel: 1, myExp: 0, maxExp: 100, globalHeat: 154000, weeklyHeat: 15000, reward: { ...MOCK_REWARDS.digital, desc: '见习守护者铭牌' }, avatar: 'https://picsum.photos/seed/idol5/100/100', bg: 'bg-indigo-50' },
];

const TOP_USERS = [
  { id: 101, name: '樱花海', avatar: 'https://picsum.photos/seed/u1/100/100', globalContribution: 125000, weeklyContribution: 15000, starId: 1 },
  { id: 102, name: '星光守护者', avatar: 'https://picsum.photos/seed/u2/100/100', globalContribution: 98000, weeklyContribution: 22000, starId: 1 },
  { id: 103, name: 'MikuFan99', avatar: 'https://picsum.photos/seed/u3/100/100', globalContribution: 85000, weeklyContribution: 8000, starId: 1 },
  { id: 104, name: '月光曲', avatar: 'https://picsum.photos/seed/u4/100/100', globalContribution: 74000, weeklyContribution: 31000, starId: 2 },
  { id: 105, name: '夜猫子', avatar: 'https://picsum.photos/seed/u5/100/100', globalContribution: 62000, weeklyContribution: 5000, starId: 2 },
  { id: 106, name: '云端漫步', avatar: 'https://picsum.photos/seed/u6/100/100', globalContribution: 51000, weeklyContribution: 2000, starId: 3 },
];

export default function RankingScreen({ onBack, glowSticks, setGlowSticks }: RankingScreenProps) {
  const [activeTab, setActiveTab] = useState<'stars' | 'users'>('stars');
  const [timeFrame, setTimeFrame] = useState<'total' | 'weekly'>('total');
  
  // Star Tab State
  const [stars, setStars] = useState(INITIAL_STARS);
  const [showOnlyFollowed, setShowOnlyFollowed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedStarId, setExpandedStarId] = useState<number | null>(null);
  const [floats, setFloats] = useState<{ id: number; starId: number; x: number; y: number }[]>([]);

  // User Tab Picker State
  const [selectedStarId, setSelectedStarId] = useState(
    INITIAL_STARS.find(s => s.isFollowed)?.id || INITIAL_STARS[0].id
  );
  const [isIdolPickerOpen, setIsIdolPickerOpen] = useState(false);

  // Computed data calculations
  const heatTarget = timeFrame === 'total' ? 'globalHeat' : 'weeklyHeat';
  const contTarget = timeFrame === 'total' ? 'globalContribution' : 'weeklyContribution';

  // 1. Calculate the real global/weekly ranks for *all* idols before filtering
  const allRankedStars = useMemo(() => {
    return [...stars]
      .sort((a, b) => b[heatTarget] - a[heatTarget])
      .map((star, index) => ({ ...star, rank: index + 1 }));
  }, [stars, heatTarget]);

  // 2. Then apply the 'followed' and 'search' filters
  const displayStars = useMemo(() => {
    let result = allRankedStars;
    if (showOnlyFollowed) {
      result = result.filter(s => s.isFollowed);
    }
    if (searchQuery.trim() !== '') {
      result = result.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [allRankedStars, showOnlyFollowed, searchQuery]);

  // Contributions specific to the selected idol, properly sorted by timeframe
  const displayUsers = useMemo(() => {
    return TOP_USERS
      .filter(u => u.starId === selectedStarId)
      .sort((a, b) => b[contTarget] - a[contTarget])
      .map((user, index) => ({ ...user, rank: index + 1 }));
  }, [selectedStarId, contTarget]);

  const selectedStarData = INITIAL_STARS.find(s => s.id === selectedStarId);

  // Actions
  const handleHeatUp = (e: React.MouseEvent, starId: number) => {
    e.stopPropagation();
    if (glowSticks < 10) return;
    
    setGlowSticks(glowSticks - 10);
    
    setStars(prev => prev.map(s => {
      if (s.id === starId) {
        let newGlobalHeat = s.globalHeat + 100;
        let newWeeklyHeat = s.weeklyHeat + 100;
        let newExp = s.myExp + 50;
        let newLevel = s.myLevel;
        let newMax = s.maxExp;
        if (newExp >= s.maxExp) {
          newLevel++;
          newExp -= s.maxExp;
          newMax = Math.floor(newMax * 1.5);
        }
        return { ...s, globalHeat: newGlobalHeat, weeklyHeat: newWeeklyHeat, myExp: newExp, myLevel: newLevel, maxExp: newMax };
      }
      return s;
    }));

    const rect = e.currentTarget.getBoundingClientRect();
    const newFloat = {
      id: Date.now() + Math.random(),
      starId,
      x: rect.left + rect.width / 2,
      y: rect.top,
    };
    setFloats(prev => [...prev, newFloat]);

    setTimeout(() => {
      setFloats(prev => prev.filter(f => f.id !== newFloat.id));
    }, 1000);
  };

  const handleToggleFollow = (e: React.MouseEvent, starId: number) => {
    e.stopPropagation();
    setStars(prev => prev.map(s => s.id === starId ? { ...s, isFollowed: !s.isFollowed } : s));
  };


  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-slate-400';
    if (rank === 3) return 'text-orange-500';
    return 'text-gray-300';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 bg-[#FAFAFA] flex flex-col z-50 text-left" 
    >
      {/* Floater Animations */}
      <AnimatePresence>
        {floats.map(f => (
          <motion.div
            key={f.id}
            initial={{ opacity: 1, x: f.x - 20, y: f.y - 20, scale: 0.5 }}
            animate={{ opacity: 0, y: f.y - 120, scale: 1.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed z-50 text-[var(--color-cheer-orange)] font-extrabold text-xl pointer-events-none drop-shadow-md flex items-center gap-1"
          >
            +50 EXP
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Modern, borderless header */}
      <div className="absolute top-0 inset-x-0 z-20 pt-10 px-6 pb-6 flex justify-between items-center bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent pointer-events-none">
        <button
          onClick={onBack}
          className="p-3 rounded-full glass bg-white/70 shadow-sm text-gray-800 hover:bg-white active:scale-95 transition-all pointer-events-auto border border-white backdrop-blur-md"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex gap-4 items-center bg-white/70 glass px-4 py-2 rounded-full shadow-sm border border-white pointer-events-auto">
          <button 
            onClick={() => setActiveTab('stars')}
            className={`font-black text-[15px] transition-colors ${activeTab === 'stars' ? 'text-gray-800' : 'text-gray-400'}`}
          >
            星光榜
          </button>
          <div className="w-[1px] h-4 bg-gray-200" />
          <button 
            onClick={() => setActiveTab('users')}
            className={`font-black text-[15px] transition-colors ${activeTab === 'users' ? 'text-gray-800' : 'text-gray-400'}`}
          >
            贡献榜
          </button>
        </div>
        <div className="w-12 pointer-events-auto" />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden pt-32 pb-[100px] flex flex-col relative w-full">
        
        {/* Toggle Controls Section (Timeframe + Filters depending on tab) */}
        <div className="px-6 mb-4 flex justify-between items-center z-10 shrink-0">
          
          {/* Global / Weekly Toggle */}
          <div className="bg-gray-100 p-1 rounded-full flex gap-1 border border-gray-200/50 shadow-inner">
            <button
              onClick={() => setTimeFrame('total')}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${
                timeFrame === 'total' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
            >
              总榜
            </button>
            <button
              onClick={() => setTimeFrame('weekly')}
              className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all flex items-center gap-1 ${
                timeFrame === 'weekly' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500'
              }`}
            >
              周榜刷新
            </button>
          </div>

          {/* Contextual Right Filter */}
          {activeTab === 'stars' && (
            <button 
              onClick={() => setShowOnlyFollowed(!showOnlyFollowed)}
              className={`px-3 py-1.5 rounded-full font-extrabold text-[11px] transition-all flex items-center gap-1.5 border border-white soft-shadow ${
                showOnlyFollowed ? 'bg-pink-50 text-pink-500 border-pink-100' : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              <Heart size={14} fill={showOnlyFollowed ? 'currentColor' : 'transparent'} className={showOnlyFollowed ? 'text-pink-500' : 'text-gray-400'} />
              只看关注
            </button>
          )}

          {activeTab === 'users' && (
            <button 
              onClick={() => setIsIdolPickerOpen(true)}
              className="px-3 py-1.5 rounded-full font-extrabold text-[11px] transition-all flex items-center gap-1 bg-white border border-gray-100 soft-shadow text-gray-700"
            >
              <img src={selectedStarData?.avatar} className="w-4 h-4 rounded-full object-cover" />
              {selectedStarData?.name} 
              <ChevronDown size={14} className="text-gray-400" />
            </button>
          )}

        </div>

        {/* Tab 1: Stars */}
        {activeTab === 'stars' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col overflow-hidden">
            
            {/* Weekly Rewards Context Banner (Only visible in Weekly mode) */}
            <AnimatePresence>
              {timeFrame === 'weekly' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 mb-4 overflow-hidden shrink-0"
                >
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 p-3 rounded-2xl flex items-start gap-3 shadow-sm">
                    <Trophy size={18} className="text-orange-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] font-bold text-orange-800 leading-relaxed">
                      周榜即时结算是给偶像争取更好资源的关键！<br/>排名前3位的明星将在这周解锁<span className="font-black text-orange-600">神秘开屏海报与实物抽选大奖</span>。
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Scrolling View */}
            <div className="flex-1 overflow-y-auto px-6 pb-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
              <div className="flex flex-col gap-4">
                {displayStars.length === 0 ? (
                  <div className="text-center text-gray-400 font-bold py-10">列表中没有找到相关偶像哦~</div>
                ) : (
                  displayStars.map((star) => {
                    const isExpanded = expandedStarId === star.id;
                    
                    return (
                      <motion.div
                        layout
                        onClick={() => setExpandedStarId(isExpanded ? null : star.id)}
                        key={star.id}
                        className={`relative flex flex-col p-4 rounded-[2rem] border-[3px] overflow-hidden bg-white cursor-pointer select-none transition-all ${
                          isExpanded ? 'border-[var(--color-primary-light)] soft-shadow shadow-xl' : 'border-white soft-shadow hover:scale-[1.01]'
                        }`}
                      >
                        {/* Always Visible Row */}
                        <div className="flex items-center w-full">
                          <div className={`font-black text-2xl w-7 text-center mr-2 ${getRankColor(star.rank)} drop-shadow-sm shrink-0`}>
                            {star.rank}
                          </div>
                          
                          <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-100 shadow-sm shrink-0">
                            <img src={star.avatar} alt={star.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          
                          <div className="ml-3 flex-1 min-w-0 pr-1 flex flex-col justify-center">
                            <h3 className="font-extrabold text-gray-800 text-lg leading-tight truncate w-full">{star.name}</h3>
                            <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--color-cheer-orange)] mt-1 bg-orange-50 w-max px-2 py-0.5 rounded-full">
                              <Flame size={12} fill="currentColor" />
                              热度: {star[heatTarget].toLocaleString()}
                            </div>
                          </div>

                          <div className="shrink-0 pl-2">
                            <button
                              onClick={(e) => handleToggleFollow(e, star.id)}
                              className={`p-2 rounded-full transition-all border ${
                                star.isFollowed ? 'bg-pink-50 text-pink-500 border-pink-100' : 'bg-white text-gray-300 border-gray-100'
                              }`}
                            >
                              <Heart size={18} fill={star.isFollowed ? 'currentColor' : 'transparent'} />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Reward & Interaction Controls */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, marginTop: 0 }}
                              animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                              exit={{ opacity: 0, height: 0, marginTop: 0 }}
                              className="w-full flex flex-col overflow-hidden border-t border-gray-50 pt-4"
                            >
                              {/* Reward Indicator UI using image/icon instead of just text */}
                              <div className="flex gap-3 items-center bg-gray-50/80 p-3 rounded-2xl mb-4 border border-gray-100">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner ${star.reward.bg}`}>
                                  {star.reward.icon}
                                </div>
                                <div className="flex flex-col flex-1">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">NEXT REWARD 解锁</span>
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${star.reward.bg}`}>{star.reward.tag}</span>
                                  </div>
                                  <span className="text-sm font-extrabold text-gray-800 line-clamp-1">{star.reward.desc}</span>
                                </div>
                              </div>

                              <div className="flex items-end gap-3 w-full">
                                {/* Next Level Bar */}
                                <div className="flex-1 flex flex-col">
                                  <div className="flex justify-between items-end mb-1.5 px-0.5">
                                    <span className="text-[11px] font-extrabold text-gray-500">LV.{star.myLevel} 我的粉丝等级</span>
                                    <span className="text-[10px] font-black text-[var(--color-primary)]">{star.myExp} / {star.maxExp}</span>
                                  </div>
                                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner relative">
                                    <motion.div 
                                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min((star.myExp / star.maxExp) * 100, 100)}%` }}
                                      transition={{ type: "spring", stiffness: 100 }}
                                    />
                                  </div>
                                </div>

                                {/* Heater Button */}
                                <motion.button
                                  onClick={(e) => handleHeatUp(e, star.id)}
                                  whileTap={{ scale: 0.9 }}
                                  className={`h-11 px-4 rounded-xl flex items-center gap-1.5 font-black text-xs shadow-lg transition-all shrink-0 border border-white/50 ${
                                    glowSticks >= 10 ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-cheer-orange)] text-white' : 'bg-gray-200 text-gray-400 shadow-none'
                                  }`}
                                >
                                  <Flame size={16} fill={glowSticks >= 10 ? 'currentColor' : 'transparent'} className={glowSticks >= 10 ? 'animate-pulse' : ''} />
                                  加热棒
                                </motion.button>
                              </div>

                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab 2: User Contribution Rankings */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full overflow-hidden">
            
            {/* Weekly Honors Context Banner (Only visible in Weekly mode) */}
            <AnimatePresence>
              {timeFrame === 'weekly' && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 mb-4 overflow-hidden shrink-0"
                >
                  <div className="bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent border-l-4 border-[var(--color-primary)] p-3 rounded-r-2xl flex items-start gap-3">
                    <Crown size={20} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <p className="text-xs font-bold text-gray-700 leading-relaxed">
                      本周霸榜福利：排行第一获得<span className="text-[var(--color-primary)] font-black mx-1">【{selectedStarData?.name} 专属高光海报称号】</span>及限定动态荣誉库头像框！
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Users List View */}
            <div className="flex-1 overflow-y-auto px-6 pb-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex flex-col gap-3 pt-2">
                {displayUsers.length === 0 ? (
                  <div className="text-center text-gray-400 font-bold py-10 border-2 border-dashed border-gray-200 rounded-3xl m-4">该明星榜单尚未产生数据~</div>
                ) : (
                  displayUsers.map((user) => (
                    <motion.div
                      layout
                      key={user.id}
                      className="flex items-center p-3.5 rounded-2xl bg-white soft-shadow border border-white"
                    >
                      <div className={`font-black text-xl w-8 text-center mr-2 ${getRankColor(user.rank)} drop-shadow-sm shrink-0`}>
                        {user.rank}
                      </div>
                      
                      <div className="relative shrink-0">
                        <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm" referrerPolicy="no-referrer" alt="" />
                        {user.rank === 1 && timeFrame === 'weekly' && (
                          <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 rounded-full p-0.5 drop-shadow-sm border border-white">
                            <Crown size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-3 flex-1 flex flex-col justify-center">
                        <span className="font-extrabold text-gray-800 text-[15px]">{user.name}</span>
                        <div className="flex items-center gap-1 mt-0.5 text-[var(--color-cheer-orange)] font-bold text-xs bg-orange-50 w-max px-2 py-0.5 rounded-md">
                          <Wand2 size={12} /> 贡献 {user[contTarget].toLocaleString()}
                        </div>
                      </div>
                      
                      {/* Index decorations for big fans */}
                      {user.rank === 1 && (
                        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 text-white font-black text-[10px] uppercase shadow-md -rotate-3 mr-1 border border-white/50">
                          MVP
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Idol Picker Modal (for Contribution Tab) */}
      <AnimatePresence>
        {isIdolPickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 z-[60] backdrop-blur-sm flex flex-col justify-end"
            onClick={() => setIsIdolPickerOpen(false)}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="bg-[#FAFAFA] rounded-t-[2.5rem] w-full max-h-[80vh] flex flex-col relative pb-10"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-4" />
              <div className="px-6 pb-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-black text-lg text-gray-800">切换关注的明星榜单</h3>
                <button onClick={() => setIsIdolPickerOpen(false)} className="p-1 rounded-full bg-gray-100 text-gray-500">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
                {/* Organize picker: Followed logic prioritizes */}
                {[...INITIAL_STARS].sort((a,b) => Number(b.isFollowed) - Number(a.isFollowed)).map(star => {
                  const isSelected = selectedStarId === star.id;
                  return (
                    <button
                      key={star.id}
                      onClick={() => {
                        setSelectedStarId(star.id);
                        setIsIdolPickerOpen(false);
                      }}
                      className={`flex items-center p-3 rounded-2xl w-full text-left transition-all border-2 ${
                        isSelected ? 'bg-white border-[var(--color-primary)] shadow-md' : 'bg-white border-transparent soft-shadow hover:bg-gray-50'
                      }`}
                    >
                      <img src={star.avatar} className="w-10 h-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="ml-3 flex-1">
                        <div className="font-extrabold text-gray-800 flex items-center gap-1.5">
                          {star.name}
                          {star.isFollowed && <Heart size={12} className="text-pink-400" fill="currentColor" />}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white mr-2 shadow-sm">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
