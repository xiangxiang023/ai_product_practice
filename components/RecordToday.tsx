
import React, { useState, useEffect, useRef } from 'react';
import { ClothingItem, OOTDRecord } from '../types';

interface RecordTodayProps {
  clothes: ClothingItem[];
  onSave: (record: OOTDRecord) => void;
  onCancel: () => void;
  initialDate?: Date;
}

export const RecordToday: React.FC<RecordTodayProps> = ({ clothes, onSave, onCancel, initialDate }) => {
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [temp, setTemp] = useState(24);
  const [condition, setCondition] = useState('晴');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showItemPicker, setShowItemPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const targetDate = initialDate || new Date();

  useEffect(() => {
    const conditions = ['晴', '多云', '小雨', '阴'];
    setCondition(conditions[Math.floor(Math.random() * conditions.length)]);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const newRecord: OOTDRecord = {
      id: Date.now().toString(),
      date: targetDate.toISOString(),
      weather: {
        temp,
        condition,
        icon: condition === '晴' ? '☀️' : condition === '多云' ? '☁️' : condition === '小雨' ? '🌧️' : '☁️'
      },
      itemIds: selectedItemIds,
      note,
      photo: photo || undefined
    };
    onSave(newRecord);
  };

  const toggleItem = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedClothes = clothes.filter(c => selectedItemIds.includes(c.id));

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col p-6 animate-in slide-in-from-bottom duration-300">
      <header className="flex justify-between items-center mb-8">
        <button onClick={onCancel} className="text-stone-400 text-sm">取消</button>
        <div className="text-center">
          <h1 className="text-lg font-serif">记录今日穿搭</h1>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">
            {targetDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={selectedItemIds.length === 0 && !photo}
          className={`text-sm font-medium ${selectedItemIds.length === 0 && !photo ? 'text-stone-200' : 'text-stone-800'}`}
        >
          完成
        </button>
      </header>

      <div className="flex-1 overflow-y-auto space-y-8 pb-10">
        {/* Weather section */}
        <div className="bg-stone-50 p-6 rounded-3xl flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-4xl">{condition === '晴' ? '☀️' : condition === '多云' ? '☁️' : '🌧️'}</span>
            <div>
              <p className="font-medium text-stone-800">{condition}</p>
              <p className="text-xs text-stone-400">实时气温</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="-10" 
              max="40" 
              value={temp} 
              onChange={(e) => setTemp(parseInt(e.target.value))}
              className="w-24 accent-stone-800"
            />
            <span className="text-lg font-medium w-10">{temp}°C</span>
          </div>
        </div>

        {/* Outfit Choice */}
        <div className="space-y-4">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">搭配记录</label>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Take Photo */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-3xl bg-stone-50 border border-stone-100 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
            >
              {photo ? (
                <img src={photo} className="w-full h-full object-cover" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-stone-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <p className="text-[10px] text-stone-400">直接拍一张</p>
                </>
              )}
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              {photo && (
                 <button onClick={(e) => { e.stopPropagation(); setPhoto(null); }} className="absolute top-2 right-2 p-1 bg-black/20 rounded-full text-white">
                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
              )}
            </div>

            {/* Select from Wardrobe */}
            <div 
              onClick={() => setShowItemPicker(true)}
              className="aspect-square rounded-3xl bg-stone-50 border border-stone-100 flex flex-col items-center justify-center cursor-pointer overflow-hidden group"
            >
               <div className="flex -space-x-4 mb-2">
                 {selectedClothes.length > 0 ? (
                    selectedClothes.slice(0, 3).map(c => (
                      <img key={c.id} src={c.image} className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm" />
                    ))
                 ) : (
                    <div className="w-10 h-10 rounded-full bg-stone-200 border-2 border-white flex items-center justify-center text-stone-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    </div>
                 )}
               </div>
               <p className="text-[10px] text-stone-400">从衣橱选择</p>
               {selectedItemIds.length > 0 && (
                 <p className="text-[10px] font-bold mt-1 text-stone-800">{selectedItemIds.length} 个单品</p>
               )}
            </div>
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 block">备忘</label>
          <textarea 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="记录今日心情或搭配灵感..."
            className="w-full h-32 p-5 rounded-[32px] bg-stone-50 border-none focus:ring-1 focus:ring-stone-200 resize-none text-stone-700 text-sm"
          />
        </div>
      </div>

      {/* Item Picker Modal */}
      {showItemPicker && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex flex-col justify-end">
          <div className="bg-white rounded-t-[40px] h-[80vh] flex flex-col p-8 animate-in slide-in-from-bottom duration-300">
            <header className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-serif">选择单品</h2>
              <button onClick={() => setShowItemPicker(false)} className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>
            <div className="flex-1 overflow-y-auto grid grid-cols-3 gap-3">
              {clothes.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => toggleItem(item.id)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-square ${
                    selectedItemIds.includes(item.id) ? 'border-stone-800 scale-95 shadow-inner' : 'border-transparent'
                  }`}
                >
                  <img src={item.image} className="w-full h-full object-cover" />
                  {selectedItemIds.includes(item.id) && (
                    <div className="absolute inset-0 bg-stone-800/20 flex items-center justify-center">
                      <div className="bg-stone-800 text-white rounded-full p-1 shadow-lg">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {clothes.length === 0 && (
                <div className="col-span-3 text-center py-20 text-stone-400 text-sm">
                  衣橱里还没有单品呢
                </div>
              )}
            </div>
            <button 
              onClick={() => setShowItemPicker(false)}
              className="mt-6 w-full py-4 bg-stone-800 text-white rounded-2xl font-medium shadow-xl"
            >
              确定 ({selectedItemIds.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
