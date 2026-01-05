
import React, { useState, useEffect, useRef } from 'react';
import { ClothingItem, OOTDRecord } from '../types';

interface RecordTodayProps {
  clothes: ClothingItem[];
  onSave: (record: OOTDRecord) => void;
  onCancel: () => void;
  onDelete?: (id: string) => void;
  initialDate?: Date;
  existingRecord?: OOTDRecord;
}

export const RecordToday: React.FC<RecordTodayProps> = ({ 
  clothes, 
  onSave, 
  onCancel, 
  onDelete,
  initialDate, 
  existingRecord 
}) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(existingRecord?.itemIds || []);
  const [note, setNote] = useState(existingRecord?.note || '');
  const [temp, setTemp] = useState(existingRecord?.weather.temp || 24);
  const [condition, setCondition] = useState(existingRecord?.weather.condition || '晴');
  const [photo, setPhoto] = useState<string | null>(existingRecord?.photo || null);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(!existingRecord); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetDate = initialDate || (existingRecord ? new Date(existingRecord.date) : new Date());

  const weatherOptions = [
    { label: '晴', icon: '☀️' },
    { label: '多云', icon: '☁️' },
    { label: '阴', icon: '🌥️' },
    { label: '雨', icon: '🌧️' },
    { label: '雪', icon: '❄️' },
  ];

  const activeIcon = weatherOptions.find(o => o.label === condition)?.icon || '☀️';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isEditing) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const newRecord: OOTDRecord = {
      id: existingRecord?.id || Date.now().toString(),
      date: targetDate.toISOString(),
      weather: {
        temp,
        condition,
        icon: activeIcon
      },
      itemIds: selectedItemIds,
      note,
      photo: photo || undefined
    };
    onSave(newRecord);
  };

  const toggleItem = (id: string) => {
    if (!isEditing) return;
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedClothes = clothes.filter(c => selectedItemIds.includes(c.id));

  return (
    <div className="fixed inset-0 bg-[#FFFBF5] z-50 flex flex-col p-5 animate-in slide-in-from-bottom duration-500 overflow-y-auto hide-scrollbar">
      <header className="flex justify-between items-center mb-6 shrink-0">
        <button onClick={onCancel} className="text-[#A79277] text-xs font-bold bg-white px-4 py-2 rounded-full border border-[#F2EBE3] active:scale-95 shadow-sm">
          返回
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-[#8D7B68] tracking-tight">
            {isEditing ? '记录此刻' : '穿搭回顾'}
          </h1>
          <p className="text-[9px] text-[#C1B094] font-bold tracking-widest mt-0.5 uppercase">
            {targetDate.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} STYLE ARCHIVE
          </p>
        </div>
        <div>
          {isEditing ? (
            <button 
              onClick={handleSave} 
              disabled={selectedItemIds.length === 0 && !photo}
              className={`text-xs font-bold px-4 py-2 rounded-full transition-all ${selectedItemIds.length === 0 && !photo ? 'bg-[#F2EBE3] text-stone-300' : 'bg-[#8D7B68] text-white shadow-md active:scale-95'}`}
            >
              完成
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="text-xs font-bold px-4 py-2 rounded-full bg-white text-[#8D7B68] border border-[#F2EBE3] active:scale-95 shadow-sm"
            >
              编辑
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-6 pb-6">
        {/* Weather card - Reduced padding/spacing */}
        <section className="space-y-2">
          <label className="text-[10px] font-bold text-[#C1B094] uppercase tracking-widest block ml-2">气象感应</label>
          <div className="bg-white border border-[#F2EBE3] rounded-[2rem] p-5 warm-shadow space-y-4">
            <div className="flex flex-col space-y-3">
              {isEditing ? (
                <div className="grid grid-cols-5 gap-1.5 bg-[#FFFBF5] p-1.5 rounded-[1.25rem] border border-[#F2EBE3]">
                  {weatherOptions.map(o => (
                    <button
                      key={o.label}
                      onClick={() => setCondition(o.label)}
                      className={`flex flex-col items-center justify-center py-2 rounded-lg transition-all ${
                        condition === o.label 
                          ? 'bg-white shadow-sm text-[#8D7B68] scale-105' 
                          : 'text-[#C1B094] opacity-50 active:scale-90'
                      }`}
                    >
                      <span className="text-lg mb-0.5">{o.icon}</span>
                      <span className="text-[9px] font-bold">{o.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-3 bg-[#FFFBF5] px-4 py-2 rounded-2xl border border-[#F2EBE3] w-fit">
                  <span className="text-xl">{activeIcon}</span>
                  <span className="text-xs font-bold text-[#4A3F35]">{condition}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-bold text-[#C1B094] uppercase tracking-wider">当前气温</span>
                <span className="text-base font-bold text-[#8D7B68]">{temp}°C</span>
              </div>
              {isEditing && (
                <div className="px-1 py-1">
                  <input 
                    type="range" min="-10" max="45" value={temp} 
                    onChange={(e) => setTemp(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between mt-1 px-0.5">
                    <span className="text-[8px] text-[#C1B094] font-medium">-10°</span>
                    <span className="text-[8px] text-[#C1B094] font-medium">15°</span>
                    <span className="text-[8px] text-[#C1B094] font-medium">45°</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Visual blocks */}
        <section className="space-y-2">
          <label className="text-[10px] font-bold text-[#C1B094] uppercase tracking-widest block ml-2">视觉留存</label>
          <div className="grid grid-cols-2 gap-3">
            {/* Outfit Photo */}
            <div 
              onClick={() => isEditing && fileInputRef.current?.click()}
              className={`aspect-square bg-white border border-[#F2EBE3] rounded-[2rem] flex flex-col items-center justify-center overflow-hidden relative warm-shadow ${isEditing ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
            >
              {photo ? (
                <img src={photo} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center opacity-40">
                  <div className="w-8 h-8 bg-[#FFFBF5] rounded-xl flex items-center justify-center mx-auto mb-1.5">
                     <svg className="w-5 h-5 text-[#A79277]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-wider">全身照</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            {/* Wardrobe selection */}
            <div 
              onClick={() => isEditing && setShowItemPicker(true)}
              className={`aspect-square bg-white border border-[#F2EBE3] rounded-[2rem] flex flex-col items-center justify-center overflow-hidden relative warm-shadow ${isEditing ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}
            >
              {selectedClothes.length > 0 ? (
                <div className="grid grid-cols-2 gap-0.5 w-full h-full bg-[#F2EBE3]">
                  {selectedClothes.slice(0, 4).map(c => (
                    <img key={c.id} src={c.image} className="w-full h-full object-cover" />
                  ))}
                  {selectedClothes.length > 4 && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                         <span className="text-white text-[10px] font-bold">+{selectedClothes.length - 3}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center opacity-40">
                  <div className="w-8 h-8 bg-[#FFFBF5] rounded-xl flex items-center justify-center mx-auto mb-1.5">
                     <svg className="w-5 h-5 text-[#A79277]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <p className="text-[8px] font-bold uppercase tracking-wider">关联单品</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Note - Reduced min-height to save space */}
        <section className="space-y-2">
          <label className="text-[10px] font-bold text-[#C1B094] uppercase tracking-widest block ml-2">碎碎念</label>
          <div className="bg-white border border-[#F2EBE3] rounded-[2rem] p-5 warm-shadow min-h-[100px]">
            {isEditing ? (
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="这一刻的搭配灵感是..."
                className="w-full h-24 bg-transparent border-none focus:ring-0 text-sm leading-relaxed text-[#4A3F35] resize-none"
              />
            ) : (
              <p className="text-sm leading-relaxed text-[#4A3F35] whitespace-pre-wrap">{note || '这一天云淡风轻，什么也没留下。'}</p>
            )}
          </div>
        </section>

        {/* Delete Record */}
        {existingRecord && isEditing && onDelete && (
          <div className="flex justify-center">
            <button 
              onClick={() => { if(confirm('真的要永久删除这条珍贵的记录吗？')) onDelete(existingRecord.id); }}
              className="text-[10px] font-bold text-red-400 px-6 py-2.5 rounded-full border border-red-50 active:bg-red-50 transition-colors"
            >
              移除这条记录
            </button>
          </div>
        )}
      </div>

      {/* Item Picker Overlay */}
      {showItemPicker && isEditing && (
        <div className="fixed inset-0 bg-[#4A3F35]/30 backdrop-blur-sm z-[60] flex flex-col justify-end animate-in fade-in duration-300">
          <div className="bg-white h-[85vh] flex flex-col p-6 rounded-t-[3rem] shadow-2xl animate-in slide-in-from-bottom duration-500 border-t border-[#F2EBE3]">
            <header className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-sm font-bold text-[#8D7B68]">选择衣橱单品</h2>
              <button onClick={() => setShowItemPicker(false)} className="w-10 h-10 bg-[#FFFBF5] rounded-full flex items-center justify-center active:scale-90 shadow-sm">
                <svg className="w-5 h-5 text-[#C1B094]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3 hide-scrollbar pb-6">
              {clothes.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedItemIds.includes(item.id) ? 'border-[#C8AE7D] scale-95 shadow-md' : 'border-[#F2EBE3]'
                  }`}
                >
                  <img src={item.image} className="w-full h-full object-cover" />
                  {selectedItemIds.includes(item.id) && (
                    <div className="absolute inset-0 bg-[#C8AE7D]/20 flex items-center justify-center">
                        <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-200">
                          <svg className="w-4 h-4 text-[#C8AE7D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                    </div>
                  )}
                </div>
              ))}
              {clothes.length === 0 && (
                  <div className="col-span-full py-20 text-center text-[#A79277] text-[10px]">
                      衣橱里还没有单品，快去添加吧！
                  </div>
              )}
            </div>
            <button 
              onClick={() => setShowItemPicker(false)}
              className="mt-2 w-full py-3.5 bg-[#8D7B68] text-white rounded-2xl text-xs font-bold shadow-lg active:scale-95 transition-all"
            >
              确认选择 ({selectedItemIds.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
