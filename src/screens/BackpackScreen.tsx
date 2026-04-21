import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, PackageOpen, Share2, X, Plus, Minus, Check, MapPin, ChevronRight, Truck } from 'lucide-react';

interface BackpackScreenProps {
  key?: string;
  onMenuClick: () => void;
}

interface InventoryItem {
  id: string; // use string id since we might split items
  baseId: number;
  name: string;
  type: string;
  rarity: string;
  image: string;
  color: string;
  quantity: number;
  status: 'inventory' | 'shipping' | 'shipped';
  shippingInfo?: {
    date: string;
    trackingNo: string;
    company: string;
    status: string;
  }
}

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: '1-inv', baseId: 1, name: '全息烫金小卡', type: 'Astrid ✨', rarity: 'SP 粉', image: 'https://picsum.photos/seed/inv1/400/600', color: 'from-[#ff9eb5] to-[#ffb3c6]', quantity: 1, status: 'inventory' },
  { id: '2-inv', baseId: 2, name: '限定亚克力立牌', type: 'Luna', rarity: 'SSR 红', image: 'https://picsum.photos/seed/inv2/200/200', color: 'from-[#ff6b6b] to-[#ff8787]', quantity: 2, status: 'inventory' },
  { id: '3-inv', baseId: 3, name: 'Q版应援徽章', type: 'Stella', rarity: 'SR 橙', image: 'https://picsum.photos/seed/inv3/200/200', color: 'from-[#ffa94d] to-[#ffc078]', quantity: 4, status: 'inventory' },
  { id: '4-inv', baseId: 4, name: '迷你演唱会玩偶', type: 'Astrid ✨', rarity: 'R 紫', image: 'https://picsum.photos/seed/inv4/400/200', color: 'from-[#b197fc] to-[#d0bfff]', quantity: 1, status: 'shipped', shippingInfo: { date: '2026-04-20 14:30', trackingNo: 'SF109283928172', company: '顺丰速运', status: '运输中' } },
];

export default function BackpackScreen({ onMenuClick }: BackpackScreenProps) {
  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [activeTab, setActiveTab] = useState<'inventory'|'shipping'|'shipped'>('inventory');
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<InventoryItem | null>(null);
  
  const [addresses, setAddresses] = useState([
    { id: 1, name: '星小明', phone: '13800138000', address: '北京市朝阳区建国门外大街1号', isDefault: true }
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(1);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({ name: '', phone: '', address: '', isDefault: false });

  // Selection state for shipping: {[baseId]: quantityToShip}
  const [shippingSelection, setShippingSelection] = useState<{[key: number]: number}>({});

  const inventoryItems = items.filter(i => i.status === 'inventory');

  const handleApplyShipping = () => {
    if (inventoryItems.length === 0) return;
    const initialSelection: {[key: number]: number} = {};
    inventoryItems.forEach(item => {
      initialSelection[item.baseId] = 0; 
    });
    setShippingSelection(initialSelection);
    setShowShippingModal(true);
    if (addresses.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0].id);
    }
  };

  const updateSelection = (baseId: number, delta: number, max: number) => {
    setShippingSelection(prev => {
      const current = prev[baseId] || 0;
      const next = Math.max(0, Math.min(max, current + delta));
      return { ...prev, [baseId]: next };
    });
  };

  const handleSaveAddress = () => {
    if (!newAddressForm.name || !newAddressForm.phone || !newAddressForm.address) return;
    const newAddr = {
      ...newAddressForm,
      id: Date.now()
    };
    if (newAddr.isDefault || addresses.length === 0) {
      setAddresses([newAddr, ...addresses.map(a => ({...a, isDefault: false}))]);
    } else {
      setAddresses([...addresses, newAddr]);
    }
    setSelectedAddressId(newAddr.id);
    setIsAddingAddress(false);
    setNewAddressForm({ name: '', phone: '', address: '', isDefault: false });
  };

  const submitShipping = () => {
    if (!selectedAddressId) {
      alert("请选择收货地址！");
      return;
    }
    
    let totalShipping = 0;
    Object.values(shippingSelection).forEach(v => totalShipping += (v as number));
    if (totalShipping === 0) {
      alert("请至少选择一件商品发货！");
      return;
    }

    let newItems = [...items];
    
    Object.entries(shippingSelection).forEach(([bIdStr, qtyVal]) => {
      const qty = qtyVal as number;
      if (qty === 0) return;
      const baseId = parseInt(bIdStr);
      const invItemIndex = newItems.findIndex(i => i.baseId === baseId && i.status === 'inventory');
      if (invItemIndex !== -1) {
        const invItem = newItems[invItemIndex];
        if (invItem.quantity === qty) {
          invItem.status = 'shipping';
        } else {
          invItem.quantity -= qty;
          newItems.push({
            ...invItem,
            id: `${invItem.baseId}-ship-${Date.now()}`,
            quantity: qty,
            status: 'shipping'
          });
        }
      }
    });

    setItems(newItems);
    setShowShippingModal(false);
    setActiveTab('shipping');
  };

  const totalShippingCount = Object.values(shippingSelection).reduce((a, b) => (a as number) + (b as number), 0) as number;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-[#FAFAFA] flex flex-col overflow-hidden"
    >
      <div className="absolute top-0 inset-x-0 z-20 pt-10 px-6 pb-6 flex justify-between items-center bg-gradient-to-b from-[#FAFAFA] via-[#FAFAFA]/90 to-transparent pointer-events-none">
        <button
          onClick={onMenuClick}
          className="p-3 rounded-full glass bg-white/70 text-gray-800 shadow-sm hover:bg-white active:scale-95 transition-all pointer-events-auto border border-white backdrop-blur-md"
        >
          <Menu size={24} />
        </button>
        <span className="font-extrabold text-gray-800 text-lg tracking-widest drop-shadow-sm pointer-events-auto uppercase">我的周边</span>
        <div className="w-12 pointer-events-auto" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-28 pb-[200px]">
        {/* State Tabs */}
        <div className="flex justify-around items-center mb-6 bg-white rounded-full p-1.5 shadow-sm border border-pink-50 w-full relative">
          <div className="absolute inset-y-1.5 left-1.5 bg-pink-100/50 border border-pink-100 rounded-full w-[calc(33%-4px)] transition-all duration-300 shadow-sm" style={{ transform: `translateX(${activeTab === 'inventory' ? '0' : activeTab === 'shipping' ? '100%' : '204%'})` }} />
          {[
            { id: 'inventory', label: '我的周边' },
            { id: 'shipping', label: '待发货' },
            { id: 'shipped', label: '已发货' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 text-center text-sm font-extrabold z-10 transition-colors ${activeTab === tab.id ? 'text-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid - NOW UNIFORM SIZES */}
        <div className="grid grid-cols-2 gap-4 auto-rows-[200px]">
          {items.map((item, idx) => {
            if (activeTab === 'inventory' && item.status !== 'inventory') return null;
            if (activeTab === 'shipping' && item.status !== 'shipping') return null;
            if (activeTab === 'shipped' && item.status !== 'shipped') return null;
            
            return (
            <motion.div
              layout
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setShowDetailModal(item)}
              className={`relative rounded-[2rem] overflow-hidden soft-shadow bg-white group border-2 border-white cursor-pointer`}
            >
              <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              
              <div className={`absolute inset-0 bg-gradient-to-t ${item.color} mix-blend-overlay opacity-50`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-md glass bg-white/40 text-white text-[10px] uppercase font-extrabold shadow-sm backdrop-blur-md border border-white/40">
                拥有 ×{item.quantity}
              </div>

              {item.status === 'shipping' && (
                <div className="absolute top-4 right-4 bg-yellow-500/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow backdrop-blur-md">
                  处理中
                </div>
              )}
              {item.status === 'shipped' && (
                <div className="absolute top-4 right-4 bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded shadow backdrop-blur-md flex items-center gap-1">
                  <Check size={12} />已发出
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-extrabold text-lg leading-tight truncate drop-shadow-md">{item.name}</h3>
                <p className="text-[11px] font-bold text-white/90 truncate drop-shadow-md mt-1">{item.type}</p>
              </div>
            </motion.div>
          )})}
        </div>
      </div>

      {activeTab === 'inventory' && (
      <div className="absolute bottom-0 inset-x-0 z-30 px-6 pt-24 pb-[100px] bg-gradient-to-t from-[#FAFAFA] via-[#FAFAFA]/95 to-transparent pointer-events-none flex items-end">
        <div className="flex gap-4 w-full pointer-events-auto">
          <motion.button
            whileTap={inventoryItems.length > 0 ? { scale: 0.95 } : {}}
            onClick={handleApplyShipping}
            className={`flex-1 rounded-2xl py-4 font-bold flex items-center justify-center gap-2 shadow-xl border ${inventoryItems.length > 0 ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-200 text-gray-400 border-gray-200 shadow-none'}`}
          >
            <PackageOpen size={20} />
            申请发货 <span className="opacity-60 text-sm ml-1">({inventoryItems.reduce((a, b) => a + b.quantity, 0)})</span>
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
      )}

      {/* Item Detail Modal */}
      <AnimatePresence>
        {showDetailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDetailModal(null)}
            className="absolute inset-0 z-[60] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl glass border border-white"
            >
              <button
                onClick={() => setShowDetailModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white z-20 hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X size={20} />
              </button>
              
              <div className={`relative w-full aspect-[3/4] bg-white border-b border-gray-100`}>
                <img src={showDetailModal.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              <div className="p-6 bg-white relative z-10 flex flex-col">
                <h3 className="text-2xl font-extrabold text-gray-800 mb-1">{showDetailModal.name}</h3>
                <p className="text-gray-500 font-bold text-sm mb-4">{showDetailModal.type}</p>
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 mb-3">
                   <span className="text-gray-500 font-bold text-sm">拥有数量</span>
                   <span className="text-[var(--color-primary)] font-black text-xl">x{showDetailModal.quantity}</span>
                </div>
                
                {/* Visual Shipped Info Preview if shipped */}
                {showDetailModal.status === 'shipped' && showDetailModal.shippingInfo && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-blue-600 font-bold mb-1">
                      <Truck size={18} /> 发货详情
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">承运公司</span>
                      <span className="font-bold text-gray-800">{showDetailModal.shippingInfo.company}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">快递单号</span>
                      <span className="font-bold text-gray-800">{showDetailModal.shippingInfo.trackingNo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">发货时间</span>
                      <span className="font-bold text-gray-800">{showDetailModal.shippingInfo.date}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-blue-100 pt-2 mt-1">
                      <span className="text-gray-500">物流状态</span>
                      <span className="font-bold text-blue-600">{showDetailModal.shippingInfo.status}</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shipping Modal */}
      <AnimatePresence>
      {showShippingModal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm pointer-events-auto">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-[#FAFAFA] w-full rounded-t-[2.5rem] p-6 pb-12 flex flex-col pt-8 max-h-[85vh]"
          >
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto absolute top-3 left-1/2 -translate-x-1/2" />
            
            <h3 className="font-extrabold text-2xl text-gray-800 mb-4">发货申请</h3>
            
            <div className="flex-1 overflow-y-auto mb-6 pr-2">
              <h4 className="font-bold text-sm text-gray-500 mb-3">选择发货周边 (库存)</h4>
              <div className="flex flex-col gap-3 mb-6">
                {inventoryItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-xl shadow-sm border border-gray-100">
                     <div className="flex items-center gap-3">
                        <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex flex-col">
                           <span className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</span>
                           <span className="text-xs text-gray-400">库: {item.quantity}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button 
                          onClick={() => updateSelection(item.baseId, -1, item.quantity)}
                          className={`p-1.5 rounded-full ${shippingSelection[item.baseId] > 0 ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-300'} transition-colors`}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-black text-gray-800 w-4 text-center">{shippingSelection[item.baseId]}</span>
                        <button 
                          onClick={() => updateSelection(item.baseId, 1, item.quantity)}
                          className={`p-1.5 rounded-full ${shippingSelection[item.baseId] < item.quantity ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]' : 'bg-gray-50 text-gray-300'} transition-colors`}
                        >
                          <Plus size={16} />
                        </button>
                     </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-gray-500">收件地址</h4>
                {!isAddingAddress && (
                  <button onClick={() => setIsAddingAddress(true)} className="text-[var(--color-primary)] text-sm font-bold flex items-center gap-1">
                    <Plus size={16} /> 新增地址
                  </button>
                )}
              </div>
              
              {isAddingAddress ? (
                <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-[var(--color-primary-light)] shadow-sm">
                  <div className="flex gap-2">
                    <input type="text" placeholder="姓名" value={newAddressForm.name} onChange={e => setNewAddressForm({...newAddressForm, name: e.target.value})} className="flex-1 bg-gray-50 px-3 py-2.5 rounded-lg text-sm outline-none font-bold text-gray-800 placeholder:text-gray-400" />
                    <input type="tel" placeholder="手机号" value={newAddressForm.phone} onChange={e => setNewAddressForm({...newAddressForm, phone: e.target.value})} className="flex-[2] bg-gray-50 px-3 py-2.5 rounded-lg text-sm outline-none font-bold text-gray-800 placeholder:text-gray-400" />
                  </div>
                  <textarea placeholder="详细地址" value={newAddressForm.address} onChange={e => setNewAddressForm({...newAddressForm, address: e.target.value})} className="w-full bg-gray-50 px-3 py-2.5 rounded-lg text-sm outline-none font-bold text-gray-800 placeholder:text-gray-400 min-h-[60px] resize-none" />
                  <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${newAddressForm.isDefault ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'bg-white border-gray-300'}`} onClick={() => setNewAddressForm({...newAddressForm, isDefault: !newAddressForm.isDefault})}>
                      {newAddressForm.isDefault && <Check size={12} className="text-white" />}
                    </div>
                    <span className="text-xs font-bold text-gray-600">设为默认收货地址</span>
                  </label>
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => setIsAddingAddress(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-lg text-sm">取消</button>
                    <button onClick={handleSaveAddress} className="flex-1 py-2.5 bg-[var(--color-primary)] text-white font-bold rounded-lg text-sm">保存并使用</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {addresses.length === 0 ? (
                    <div className="p-6 bg-gray-50 rounded-xl text-center border border-dashed border-gray-200">
                      <p className="text-gray-400 font-medium text-sm mb-2">暂无可用地址</p>
                      <button onClick={() => setIsAddingAddress(true)} className="bg-white px-4 py-2 rounded-full text-[var(--color-primary)] font-bold shadow-sm border border-gray-100">前往添加</button>
                    </div>
                  ) : (
                    addresses.map(addr => (
                      <div 
                        key={addr.id} 
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-xl border-2 transition-colors cursor-pointer flex items-start gap-3 ${selectedAddressId === addr.id ? 'bg-[var(--color-primary)]/5 border-[var(--color-primary)]' : 'bg-white border-gray-100 shadow-sm'}`}
                      >
                        <MapPin size={20} className={`mt-0.5 ${selectedAddressId === addr.id ? 'text-[var(--color-primary)]' : 'text-gray-400'}`} />
                        <div className="flex flex-col flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-extrabold text-gray-800">{addr.name}</span>
                            <span className="font-bold text-gray-500 text-sm">{addr.phone}</span>
                            {addr.isDefault && <span className="bg-red-100 text-red-500 text-[10px] px-1.5 py-0.5 rounded font-black">默认</span>}
                          </div>
                          <span className="text-sm text-gray-600 font-medium">{addr.address}</span>
                        </div>
                        {selectedAddressId === addr.id && <Check size={20} className="text-[var(--color-primary)]" />}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
               <button onClick={() => setShowShippingModal(false)} className="flex-1 py-4 bg-gray-200 text-gray-600 font-bold rounded-xl active:scale-95 transition-transform">取消</button>
               <button 
                 onClick={submitShipping} 
                 disabled={!selectedAddressId || totalShippingCount === 0}
                 className={`flex-[2] py-4 font-bold rounded-xl active:scale-95 transition-transform ${selectedAddressId && totalShippingCount > 0 ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary-light)]/50' : 'bg-[var(--color-primary-light)]/50 text-white/70'}`}
               >
                  确认打包发货 ({totalShippingCount}件)
               </button>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}

