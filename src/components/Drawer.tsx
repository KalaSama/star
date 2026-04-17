import { motion, AnimatePresence } from 'motion/react';
import { Settings, X, Heart, Trophy, CalendarCheck, Wand2, QrCode } from 'lucide-react';
import { ScreenState } from '../App';
import { useState } from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: ScreenState) => void;
  currentScreen: ScreenState;
  glowSticks: number;
}

export default function Drawer({ isOpen, onClose, onNavigate, currentScreen, glowSticks }: DrawerProps) {
  const [showWechatModal, setShowWechatModal] = useState(false);

  const menuItems = [
    { id: 'ranking', label: '星光榜', icon: Trophy, bg: 'bg-orange-50', color: 'text-orange-500' },
    { id: 'checkin', label: '每日签到', icon: CalendarCheck, bg: 'bg-pink-50', color: 'text-[var(--color-primary)]' },
  ] as const;

  return (
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
            <div className="px-6 mb-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden mb-3">
                <img src="https://picsum.photos/seed/myuser/200/200" alt="User" />
              </div>
              <h2 className="text-xl font-extrabold text-gray-800">星柚子</h2>
              <div className="flex items-center gap-1.5 mt-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-gray-100">
                <Wand2 size={16} className="text-[var(--color-primary)]" />
                <span className="font-extrabold text-sm text-[var(--color-primary)]">{glowSticks} <span className="text-gray-400 font-medium ml-1">棒</span></span>
              </div>
            </div>

            <nav className="flex flex-col gap-3 px-4">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-1">功能区</div>
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
                        : 'hover:bg-white font-medium'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${item.bg}`}>
                      <Icon size={20} className={item.color} />
                    </div>
                    <span className={`text-lg ${isActive ? 'text-gray-800' : 'text-gray-600'}`}>{item.label}</span>
                  </button>
                );
              })}
              
              <div className="mt-4 border-t border-gray-100 pt-4 text-xs font-bold text-gray-400 uppercase tracking-widest pl-2 mb-1">偏好</div>
              <button
                className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 hover:bg-white font-medium group"
              >
                <div className="p-2 rounded-xl bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <Settings size={20} className="text-gray-500" />
                </div>
                <span className="text-lg text-gray-600">设置</span>
              </button>
            </nav>

            <div className="mt-auto px-6">
              <div className="p-5 rounded-[2rem] bg-gradient-to-br from-[#FFB7B2]/40 to-white text-sm text-gray-600 flex flex-col gap-2 relative overflow-hidden soft-shadow border border-pink-100/50">
                <QrCode size={50} className="absolute -bottom-2 -right-2 text-pink-500/10" />
                <p className="font-extrabold text-gray-800 text-lg">官方粉丝群</p>
                <p className="z-10 font-bold leading-relaxed">添加企业微信特派福利官，领超多打榜补给！</p>
                <button 
                  onClick={() => setShowWechatModal(true)}
                  className="mt-2 w-full py-3 bg-white rounded-xl font-bold text-[var(--color-primary)] shadow-sm z-10 transition-transform active:scale-95 border border-pink-50"
                >
                  扫码领福利
                </button>
              </div>
            </div>
          </motion.div>

          {/* WeChat QR Modal */}
          <AnimatePresence>
            {showWechatModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
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
                  <h3 className="text-xl font-extrabold text-gray-800 tracking-tight mb-2">添加官方福利官</h3>
                  <p className="text-sm font-bold text-gray-500 text-center mb-6">扫码添加企业微信，领专属补给大礼包、进核心粉丝打榜互助群！</p>
                  
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
  );
}
