
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
      category: category || '未分类',
      color: color || '#808080',
      image,
      createdAt: Date.now()
    };
    onAdd(newItem);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <header className="px-8 py-6 border-b border-stone-50 flex justify-between items-center">
          <h2 className="text-xl font-serif text-stone-800">添加单品</h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Image Picker */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square rounded-3xl bg-stone-50 border border-stone-100 flex flex-col items-center justify-center cursor-pointer hover:bg-stone-100 transition-all group overflow-hidden"
          >
            {image ? (
              <img src={image} className="w-full h-full object-cover" />
            ) : (
              <>
                <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-6 h-6 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
                <p className="text-xs text-stone-400 font-medium">点击上传衣物照片</p>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">单品名称</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：复古牛仔外套"
                className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-none focus:ring-1 focus:ring-stone-200 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">分类</label>
                <input 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="上装, 鞋子..."
                  className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-none focus:ring-1 focus:ring-stone-200 text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">主要颜色</label>
                <input 
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="白色, 黑色..."
                  className="w-full px-5 py-4 rounded-2xl bg-stone-50 border-none focus:ring-1 focus:ring-stone-200 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <footer className="p-8 pt-0 flex space-x-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 text-stone-400 text-sm font-medium"
          >
            取消
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!name || !image}
            className={`flex-1 py-4 bg-stone-800 text-white rounded-2xl font-medium shadow-xl transition-all ${(!name || !image) ? 'opacity-30' : 'hover:scale-[1.02] active:scale-95'}`}
          >
            保存单品
          </button>
        </footer>
      </div>
    </div>
  );
};
