
import React, { useState, useRef } from 'react';
import { ClothingItem } from '../types';

interface AddClothingModalProps {
  onClose: () => void;
  onAdd: (item: ClothingItem) => void;
}

export const AddClothingModal: React.FC<AddClothingModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!name || !image) return;
    const newItem: ClothingItem = {
      id: Date.now().toString(),
      name,
      category: category || '其他',
      color: color || '无色',
      image,
      createdAt: Date.now()
    };
    onAdd(newItem);
  };

  return (
    <div className="fixed inset-0 bg-[#4A3F35]/20 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in duration-300 rounded-[2.5rem] shadow-2xl border border-[#F2EBE3]">
        <header className="px-8 py-6 border-b border-[#FFFBF5] flex justify-between items-center">
          <h2 className="text-base font-bold text-[#8D7B68] tracking-tight">新增宝贝单品</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFFBF5] transition-colors">
            <svg className="w-5 h-5 text-[#C1B094]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
          {/* Image Picker */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-[3/4] bg-[#FFFBF5] border-2 border-dashed border-[#F2EBE3] rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:border-[#C1B094] transition-all overflow-hidden relative group"
          >
            {image ? (
              <img src={image} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center group-hover:scale-105 transition-transform">
                <div className="w-12 h-12 bg-[#F2EBE3] rounded-2xl flex items-center justify-center mx-auto mb-3">
                   <svg className="w-6 h-6 text-[#A79277]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <p className="text-xs font-bold text-[#A79277] uppercase tracking-widest">拍个照存起来</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-[#C1B094] uppercase tracking-widest mb-2 block">单品昵称</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="给心爱的单品起个名吧..."
                className="w-full px-4 py-3 bg-[#FFFBF5] rounded-xl border border-[#F2EBE3] focus:border-[#8D7B68] focus:ring-0 text-sm transition-all text-[#4A3F35]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-[#C1B094] uppercase tracking-widest mb-2 block">分类</label>
                <input 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="如: 上衣"
                  className="w-full px-4 py-3 bg-[#FFFBF5] rounded-xl border border-[#F2EBE3] focus:border-[#8D7B68] focus:ring-0 text-sm transition-all text-[#4A3F35]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#C1B094] uppercase tracking-widest mb-2 block">色系</label>
                <input 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="如: 米白"
                  className="w-full px-4 py-3 bg-[#FFFBF5] rounded-xl border border-[#F2EBE3] focus:border-[#8D7B68] focus:ring-0 text-sm transition-all text-[#4A3F35]"
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="p-8 pt-2 flex space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-[#A79277] text-xs font-bold rounded-2xl hover:bg-[#FFFBF5]"
          >
            算啦
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!name || !image}
            className={`flex-1 py-4 bg-[#8D7B68] text-white text-xs font-bold rounded-2xl shadow-lg transition-all ${(!name || !image) ? 'opacity-30 cursor-not-allowed' : 'active:scale-95 hover:bg-[#7A6A5A]'}`}
          >
            保存资产
          </button>
        </footer>
      </div>
    </div>
  );
};