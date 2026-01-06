
import React from 'react';
import { ClothingItem, OOTDRecord } from '../types';

interface BentoGridProps {
  recentItems: ClothingItem[];
  recentRecords: OOTDRecord[];
  onNavigate: (view: any) => void;
}

export const BentoGrid: React.FC<BentoGridProps> = ({ recentItems, recentRecords, onNavigate }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Wardrobe Preview */}
      <div 
        onClick={() => onNavigate('wardrobe')}
        className="bg-white p-6 flex flex-col justify-between active:scale-[0.98] transition-all rounded-[2rem] warm-shadow min-h-[200px] cursor-pointer border border-[var(--theme-secondary)]"
      >
        <div>
          <h2 className="text-base font-bold text-[var(--theme-primary)]">我的衣橱</h2>
          <p className="text-[10px] text-[var(--theme-muted)] uppercase tracking-widest mt-0.5">Closet Assets</p>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {recentItems.length > 0 ? (
            recentItems.slice(0, 2).map((item) => (
              <div 
                key={item.id} 
                className="w-14 h-18 bg-[var(--theme-bg)] rounded-xl border border-[var(--theme-secondary)] overflow-hidden"
              >
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            <div className="w-full flex flex-col items-center py-4 opacity-30">
              <div className="w-8 h-8 rounded-full bg-[var(--theme-secondary)] mb-1" />
              <p className="text-[9px] font-bold uppercase">Empty</p>
            </div>
          )}
        </div>
      </div>

      {/* Journal Preview */}
      <div 
        onClick={() => onNavigate('calendar')}
        className="bg-white p-6 flex flex-col justify-between active:scale-[0.98] transition-all rounded-[2rem] warm-shadow min-h-[200px] cursor-pointer border border-[var(--theme-secondary)]"
      >
        <div>
          <h2 className="text-base font-bold text-[var(--theme-primary)]">穿搭日志</h2>
          <p className="text-[10px] text-[var(--theme-muted)] uppercase tracking-widest mt-0.5">Style Journal</p>
        </div>

        <div className="mt-4 space-y-3 flex-1 overflow-hidden">
          {recentRecords.length > 0 ? (
            recentRecords.slice(0, 3).map((record) => (
              <div key={record.id} className="flex items-center space-x-2">
                <span className="text-[10px] font-bold text-[var(--theme-primary)] bg-[var(--theme-secondary)] px-1.5 py-0.5 rounded-md">
                  {new Date(record.date).toLocaleDateString('zh-CN', { day: 'numeric', month: 'numeric' })}
                </span>
                <p className="text-[11px] text-[var(--theme-text)] truncate flex-1">
                   {record.note || '记录美好的一天'}
                </p>
              </div>
            ))
          ) : (
            <div className="py-4 text-center opacity-30">
               <p className="text-[9px] font-bold uppercase tracking-widest">No entries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
