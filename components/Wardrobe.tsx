
import React, { useState } from 'react';
import { ClothingItem } from '../types';

interface WardrobeProps {
  items: ClothingItem[];
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
}

export const Wardrobe: React.FC<WardrobeProps> = ({ items, onAddItem, onDeleteItem }) => {
  const [activeTab, setActiveTab] = useState<string>('全部');

  const dynamicCategories = Array.from(new Set(items.map(item => item.category))).filter(Boolean);
  const tabs = ['全部', ...dynamicCategories];

  const filteredItems = activeTab === '全部' 
    ? items 
    : items.filter(item => item.category === activeTab);

  return (
    <div className="flex flex-col h-full bg-[#FFFBF5]">
      <header className="flex justify-between items-center mb-8 px-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#8D7B68]">衣橱资产</h1>
          <p className="text-xs text-[#A79277] font-medium tracking-widest mt-1 uppercase">Closet Collection</p>
        </div>
        <button 
          onClick={onAddItem}
          className="w-12 h-12 bg-[#8D7B68] text-white rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
        </button>
      </header>

      {/* Tabs - Rounded pills */}
      <div className="flex space-x-3 overflow-x-auto pb-4 hide-scrollbar px-1 mb-6">
        {tabs.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all border ${
              activeTab === cat 
              ? 'bg-[#8D7B68] text-white border-[#8D7B68]' 
              : 'bg-white text-[#A79277] border-[#F2EBE3]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid - Rounded card style */}
      <div className="grid grid-cols-2 gap-6 mt-2 pb-24 overflow-y-auto px-1">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex flex-col group bg-white rounded-[2rem] p-3 warm-shadow border border-[#F2EBE3]">
            <div className="relative overflow-hidden aspect-[4/5] rounded-[1.5rem] mb-3 group-active:opacity-80 transition-opacity">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              
              <button 
                onClick={(e) => { e.stopPropagation(); if(confirm('确定要删除这件心爱的单品吗？')) onDeleteItem(item.id); }}
                className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full text-[#4A3F35] flex items-center justify-center border border-[#F2EBE3] active:bg-red-50 active:text-red-500 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-1 px-1">
              <p className="text-sm font-bold text-[#4A3F35] truncate">{item.name}</p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#A79277] font-medium uppercase tracking-wider">{item.category}</span>
                <div className="flex items-center space-x-1">
                    <span className="text-[10px] text-[#A79277]">{item.color}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[#F2EBE3] rounded-full mb-4 flex items-center justify-center text-[#C1B094]">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" /></svg>
            </div>
            <p className="text-[#A79277] text-sm font-bold tracking-widest">你的衣橱还是空的呢</p>
          </div>
        )}
      </div>
    </div>
  );
};