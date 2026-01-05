
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

  const monthYearStr = currentDate.toLocaleDateString('zh-CN', { month: 'long', year: 'numeric' });

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

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onDayClick(selectedDate);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[40px] p-8 shadow-sm border border-stone-100">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-serif text-stone-800">{monthYearStr}</h1>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Fashion Timeline</p>
        </div>
        <div className="flex space-x-1">
          <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center hover:bg-stone-50 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-7 gap-2 flex-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-[10px] uppercase font-bold text-stone-300 mb-4">{d}</div>
        ))}
        {days.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} />;
          
          const record = getRecordForDay(day);
          // Prefer record photo, then first item image
          const displayImage = record?.photo || (record && clothes.find(c => c.id === record.itemIds[0])?.image);

          return (
            <div 
              key={day} 
              onClick={() => handleDateSelect(day)}
              className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-all hover:scale-105 active:scale-95 group shadow-sm bg-stone-50 ${record ? 'ring-1 ring-stone-200' : 'hover:bg-stone-100'}`}
            >
              <span className={`text-[10px] z-10 absolute top-1.5 left-2 ${record ? 'text-white drop-shadow-lg font-bold' : 'text-stone-400 group-hover:text-stone-600'}`}>{day}</span>
              {record && (
                <div className="w-full h-full relative">
                  {displayImage ? (
                    <img src={displayImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-stone-200" />
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <span className="absolute bottom-1 right-1 text-[10px] drop-shadow-lg">{record.weather.icon}</span>
                </div>
              )}
              {!record && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                   <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
