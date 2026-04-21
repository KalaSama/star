import { motion, AnimatePresence } from 'motion/react';
import { X, Wand2, History, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useState } from 'react';

interface GlowSticksRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlowSticksRecordModal({ isOpen, onClose }: GlowSticksRecordModalProps) {
  const [activeTab, setActiveTab] = useState<'obtain' | 'consume'>('obtain');
  
  const records = [
    { id: 1, type: 'obtain', amount: 50, reason: '每日签到', time: '2026-04-21 08:30:00' },
    { id: 2, type: 'consume', amount: -60, reason: '星光榜应援 (Astrid)', time: '2026-04-20 19:45:12' },
    { id: 3, type: 'obtain', amount: 300, reason: '点赞进度奖励', time: '2026-04-19 09:12:34' },
    { id: 4, type: 'obtain', amount: 200, reason: '抽取星盲盒', time: '2026-04-18 20:00:00' },
    { id: 5, type: 'obtain', amount: 100, reason: '动态分享', time: '2026-04-15 10:00:00' },
    { id: 6, type: 'consume', amount: -30, reason: '星光榜应援 (Luna)', time: '2026-04-14 11:20:00' },
  ];

  const displayRecords = records.filter(r => r.type === activeTab);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative max-h-[80vh]"
          >
            <div className="absolute top-4 right-4 z-10">
              <button onClick={onClose} className="p-2 rounded-full bg-black/5 text-gray-500 hover:bg-black/10 active:scale-95 transition-all">
                <X size={20} />
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 flex flex-col items-center border-b border-orange-100">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-cheer-orange)] flex items-center justify-center text-white shadow-xl shadow-orange-500/20 mb-3 border-[4px] border-white">
                <Wand2 size={32} />
              </div>
              <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">星光棒明细</h2>
              <p className="text-xs text-gray-500 font-bold mt-1">记录星光棒获取与消耗</p>
            </div>

            <div className="flex gap-2 p-4 bg-[#FAFAFA] border-b border-gray-100 shrink-0">
               <button 
                 onClick={() => setActiveTab('obtain')}
                 className={`flex-1 py-3 rounded-2xl font-extrabold text-sm flex justify-center items-center gap-2 transition-all ${activeTab === 'obtain' ? 'bg-white text-[var(--color-primary)] shadow-sm border border-gray-100' : 'text-gray-400 hover:bg-white/50'}`}
               >
                 <ArrowDownToLine size={16} /> 获取
               </button>
               <button 
                 onClick={() => setActiveTab('consume')}
                 className={`flex-1 py-3 rounded-2xl font-extrabold text-sm flex justify-center items-center gap-2 transition-all ${activeTab === 'consume' ? 'bg-white text-gray-800 shadow-sm border border-gray-100' : 'text-gray-400 hover:bg-white/50'}`}
               >
                 <ArrowUpFromLine size={16} /> 消耗
               </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2 bg-[#FAFAFA]">
              <div className="flex flex-col gap-3 my-4">
                {displayRecords.length === 0 ? (
                  <div className="text-center py-10 text-gray-400 font-bold text-sm">暂无记录</div>
                ) : (
                  displayRecords.map(record => (
                    <div key={record.id} className="flex justify-between items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${record.type === 'obtain' ? 'bg-orange-50 text-[var(--color-primary)]' : 'bg-gray-50 text-gray-500'}`}>
                           {record.type === 'obtain' ? <Wand2 size={24} /> : <History size={24} />}
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-extrabold text-[15px] text-gray-800">{record.reason}</span>
                          <span className="text-[11px] text-gray-400 font-bold tracking-wider">{record.time}</span>
                        </div>
                      </div>
                      <span className={`font-black text-xl ${record.type === 'obtain' ? 'text-[var(--color-primary)]' : 'text-gray-800'}`}>
                        {record.amount > 0 ? `+${record.amount}` : record.amount}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
