
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
    <div className="flex flex-col h-full bg-[var(--theme-bg)]">
      <header className="flex justify-between items-center mb-8 px-1">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-primary)]">衣橱资产</h1>
          <p className="text-xs text-[var(--theme-muted)] font-medium tracking-widest mt-1 uppercase">Closet Collection</p>
        </div>
        <button 
          onClick={onAddItem}
          className="w-12 h-12 bg-[var(--theme-primary)] text-white rounded-2xl flex items-center justify-center active:scale-90 transition-transform shadow-md"
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
            className={`text-xs font-bold px-4 py-2 rounded-full transition-all border shrink-0 ${
              activeTab === cat 
              ? 'bg-[var(--theme-primary)] text-white border-[var(--theme-primary)]' 
              : 'bg-white text-[var(--theme-muted)] border-[var(--theme-secondary)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid - Fixed card size consistency */}
      <div className="grid grid-cols-2 gap-4 mt-2 pb-24 overflow-y-auto px-1">
        {filteredItems.map((item) => (
          <div key={item.id} className="flex flex-col h-[280px] bg-white rounded-[2rem] p-3 warm-shadow border border-[var(--theme-secondary)] overflow-hidden">
            <div className="relative overflow-hidden aspect-[4/5] rounded-[1.5rem] mb-3 shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              
              <button 
                onClick={(e) => { e.stopPropagation(); if(confirm('确定要删除这件心爱的单品吗？')) onDeleteItem(item.id); }}
                className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full text-[var(--theme-text)] flex items-center justify-center border border-[var(--theme-secondary)] active:bg-red-50 active:text-red-500 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex flex-col flex-1 justify-between min-h-0 px-1 pb-1 overflow-hidden">
              <p className="text-sm font-bold text-[var(--theme-text)] truncate w-full">{item.name}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-[var(--theme-muted)] font-medium uppercase tracking-wider truncate flex-1 mr-2">{item.category}</span>
                <span className="text-[10px] text-[var(--theme-muted)] shrink-0">{item.color}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-[var(--theme-secondary)] rounded-full mb-4 flex items-center justify-center text-[var(--theme-muted)]">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 4-8-4" /></svg>
            </div>
            <p className="text-[var(--theme-muted)] text-sm font-bold tracking-widest">你的衣橱还是空的呢</p>
          </div>
        )}
      </div>
    </div>
  );
};
