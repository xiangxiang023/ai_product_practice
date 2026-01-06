
import React, { useState } from 'react';
import { OOTDRecord, ClothingItem } from '../types';

interface CalendarViewProps {
  records: OOTDRecord[];
  clothes: ClothingItem[];
  onDayClick: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ records, clothes, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthStr = currentDate.toLocaleDateString('zh-CN', { month: 'long' });
  const yearStr = currentDate.getFullYear();

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));

  const getRecordForDay = (day: number) => {
    return records.find(r => {
      const d = new Date(r.date);
      return d.getDate() === day && 
             d.getMonth() === currentDate.getMonth() && 
             d.getFullYear() === currentDate.getFullYear();
    });
  };

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth(currentDate.getFullYear(), currentDate.getMonth()); i++) days.push(i);

  return (
    <div className="flex flex-col h-full bg-[var(--theme-bg)] px-1">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-primary)]">{monthStr}</h1>
          <p className="text-xs text-[var(--theme-muted)] font-medium tracking-widest mt-1">{yearStr} · 穿搭日记</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center bg-white rounded-full warm-shadow border border-[var(--theme-secondary)] active:bg-[var(--theme-secondary)] transition-colors">
            <svg className="w-5 h-5 text-[var(--theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center bg-white rounded-full warm-shadow border border-[var(--theme-secondary)] active:bg-[var(--theme-secondary)] transition-colors">
            <svg className="w-5 h-5 text-[var(--theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] overflow-hidden warm-shadow border border-[var(--theme-secondary)] p-4">
        <div className="grid grid-cols-7 gap-2">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="text-center text-[11px] font-bold text-[var(--theme-muted)] py-3">{d}</div>
          ))}
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;
            
            const record = getRecordForDay(day);
            const displayImage = record?.photo || (record && clothes.find(c => c.id === record.itemIds[0])?.image);

            return (
              <div 
                key={day} 
                onClick={() => onDayClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`aspect-square relative rounded-xl overflow-hidden cursor-pointer group active:scale-95 transition-all flex flex-col items-center justify-center ${record ? 'bg-white' : 'hover:bg-[var(--theme-bg)]'}`}
              >
                <span className={`text-xs z-10 font-bold transition-colors ${record ? 'text-white' : 'text-[var(--theme-primary)]'}`}>{day}</span>
                {record && (
                  <div className="absolute inset-0 w-full h-full">
                    {displayImage ? (
                      <img src={displayImage} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-[var(--theme-primary)] opacity-60" />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="absolute bottom-1 right-1 text-[10px] drop-shadow-sm">{record.weather.icon}</span>
                  </div>
                )}
                {!record && (
                  <div className="mt-1 w-1 h-1 rounded-full bg-transparent group-hover:bg-[var(--theme-muted)] transition-colors" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 flex items-center justify-center space-x-6 text-[var(--theme-muted)] text-xs font-medium">
          <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-white border border-[var(--theme-secondary)]" />
              <span>未记录</span>
          </div>
          <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[var(--theme-primary)]" />
              <span>有记录</span>
          </div>
      </div>
    </div>
  );
};
