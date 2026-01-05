
import React from 'react';
import { ClothingItem, OOTDRecord } from '../types';

interface BentoGridProps {
  recentItems: ClothingItem[];
  recentRecords: OOTDRecord[];
  onNavigate: (view: any) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ recentItems, recentRecords, onNavigate }) => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Wardrobe Preview - Left */}
      <div 
        onClick={() => onNavigate('wardrobe')}
        className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between overflow-hidden group border border-stone-100 min-h-[220px]"
      >
        <div>
          <h2 className="text-xl font-serif mb-0.5">我的衣橱</h2>
          <p className="text-stone-400 text-[10px] uppercase tracking-wider">My Closet</p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-1.5 relative justify-center">
          {recentItems.length > 0 ? (
            recentItems.slice(0, 3).map((item, idx) => (
              <div 
                key={item.id} 
                className={`w-14 h-14 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 transition-transform group-hover:scale-110`}
                style={{ transform: `rotate(${idx % 2 === 0 ? -4 : 4}deg) translateY(${idx * 2}px)` }}
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center py-6 opacity-20">
              <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <p className="text-[10px]">衣橱空荡荡</p>
            </div>
          )}
        </div>
      </div>

      {/* Journal Preview - Right */}
      <div 
        onClick={() => onNavigate('calendar')}
        className="bg-[#EFEEEC] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between border border-stone-200/50 min-h-[220px]"
      >
        <div>
          <h2 className="text-xl font-serif mb-0.5">穿搭日志</h2>
          <p className="text-stone-400 text-[10px] uppercase tracking-wider">Journal</p>
        </div>

        <div className="mt-4 space-y-3 flex-1 overflow-hidden">
          {recentRecords.length > 0 ? (
            recentRecords.slice(0, 3).map((record) => (
              <div key={record.id} className="flex items-center space-x-2 border-l border-stone-300 pl-3 py-0.5">
                <span className="text-[10px] font-medium text-stone-500 w-8">
                  {new Date(record.date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })}
                </span>
                <span className="text-sm opacity-80">{record.weather.icon}</span>
                <p className="text-[11px] text-stone-600 truncate">{record.note || '今日记录'}</p>
              </div>
            ))
          ) : (
            <div className="py-6 text-center opacity-30">
              <p className="text-[10px]">记录今天的样子</p>
            </div>
          )}
        </div>

        <div className="mt-2 flex justify-end">
           <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
           </div>
        </div>
      </div>
    </div>
  );
};
