
import React, { useState } from 'react';
import { ClothingItem } from '../types';

interface WardrobeProps {
  items: ClothingItem[];
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
}

export const Wardrobe: React.FC<WardrobeProps> = ({ items, onAddItem, onDeleteItem }) => {
  const [activeTab, setActiveTab] = useState<string>('全部');

  // Extract unique categories from items
  const dynamicCategories = Array.from(new Set(items.map(item => item.category))).filter(Boolean);
  const tabs = ['全部', ...dynamicCategories];

  const filteredItems = activeTab === '全部' 
    ? items 
    : items.filter(item => item.category === activeTab);

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif">我的衣橱</h1>
        <button 
          onClick={onAddItem}
          className="w-10 h-10 bg-stone-800 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
        {tabs.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-all ${
              activeTab === cat 
              ? 'bg-stone-800 text-white' 
              : 'bg-white text-stone-500 border border-stone-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 pb-20 overflow-y-auto pr-2">
        {filteredItems.map((item) => (
          <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-50 aspect-[3/4]">
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
              <p className="text-white text-sm font-medium">{item.name}</p>
              <div className="flex justify-between items-center">
                <p className="text-white/70 text-xs">{item.category}</p>
                <div className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: item.color }} />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
                className="absolute top-2 right-2 p-1.5 bg-white/20 hover:bg-red-500/80 rounded-full text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="col-span-full py-20 text-center text-stone-400">
            暂无衣物，点击右上角添加
          </div>
        )}
      </div>
    </div>
  );
};
