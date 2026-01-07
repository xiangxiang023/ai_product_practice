
import React, { useState, useRef, useEffect } from 'react';
import { OOTDRecord, ClothingItem } from '../types';

interface CalendarViewProps {
  records: OOTDRecord[];
  clothes: ClothingItem[];
  onDayClick: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ records, clothes, onDayClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthStr = currentDate.toLocaleDateString('zh-CN', { month: 'long' });
  const yearStr = currentDate.getFullYear();

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

  const handleDateSelect = (year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1));
    setIsPickerOpen(false);
  };

  const today = new Date();
  const isToday = (day: number) => 
    day === today.getDate() && 
    currentDate.getMonth() === today.getMonth() && 
    currentDate.getFullYear() === today.getFullYear();

  return (
    <div className="flex flex-col h-full bg-[var(--theme-bg)] px-1">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-primary)]">{monthStr}</h1>
          <p className="text-xs text-[var(--theme-muted)] font-medium tracking-widest mt-1">{yearStr} · 穿搭日记</p>
        </div>
        <button 
          onClick={() => setIsPickerOpen(true)}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl warm-shadow border border-[var(--theme-secondary)] active:scale-90 transition-all"
        >
          <svg className="w-6 h-6 text-[var(--theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
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
            const todayMark = isToday(day);

            return (
              <div 
                key={day} 
                onClick={() => onDayClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                className={`aspect-square relative rounded-xl overflow-hidden cursor-pointer group active:scale-95 transition-all flex flex-col items-center justify-center ${record ? 'bg-white' : 'hover:bg-[var(--theme-bg)]'}`}
              >
                <div className={`z-10 w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                    todayMark ? 'bg-[var(--theme-primary)] text-white shadow-md' : 
                    record ? 'text-white drop-shadow-sm' : 
                    'text-[var(--theme-primary)]'
                  }`}>
                  <span className={`text-xs font-bold`}>{day}</span>
                </div>
                
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
                {!record && !todayMark && (
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
              <span>今日 / 有穿搭</span>
          </div>
      </div>

      {isPickerOpen && (
        <DatePickerModal 
          initialYear={currentDate.getFullYear()} 
          initialMonth={currentDate.getMonth()} 
          onConfirm={handleDateSelect} 
          onClose={() => setIsPickerOpen(false)} 
        />
      )}
    </div>
  );
};

interface DatePickerModalProps {
  initialYear: number;
  initialMonth: number;
  onConfirm: (year: number, month: number) => void;
  onClose: () => void;
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({ initialYear, initialMonth, onConfirm, onClose }) => {
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const yearContainerRef = useRef<HTMLDivElement>(null);
  const monthContainerRef = useRef<HTMLDivElement>(null);
  
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);

  useEffect(() => {
    // Initial scroll to current selection
    const scrollSelection = () => {
      const activeYear = yearContainerRef.current?.querySelector(`[data-year="${selectedYear}"]`);
      const activeMonth = monthContainerRef.current?.querySelector(`[data-month="${selectedMonth}"]`);
      
      activeYear?.scrollIntoView({ behavior: 'auto', block: 'center' });
      activeMonth?.scrollIntoView({ behavior: 'auto', block: 'center' });
    };

    const timer = setTimeout(scrollSelection, 100);
    return () => clearTimeout(timer);
  }, [selectedYear, selectedMonth]); // Added dependencies to ensure it定格 in case state updates

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-end animate-in fade-in duration-300">
      <div className="w-full bg-white rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-500 shadow-2xl border-t border-[var(--theme-secondary)]">
        <header className="flex justify-between items-center mb-8">
          <h2 className="text-base font-bold text-[var(--theme-primary)]">跳转至时间线</h2>
          <button onClick={onClose} className="p-2 bg-[var(--theme-bg)] rounded-full text-[var(--theme-muted)] active:scale-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex gap-4 mb-8">
          {/* Year Column */}
          <div 
            ref={yearContainerRef}
            className="flex-1 h-48 overflow-y-auto hide-scrollbar snap-y snap-mandatory bg-[var(--theme-bg)] rounded-3xl p-2 border border-[var(--theme-secondary)]"
          >
            <div className="py-16">
              {years.map(y => (
                <button
                  key={y}
                  data-year={y}
                  onClick={() => setSelectedYear(y)}
                  className={`w-full py-4 snap-center text-sm font-bold transition-all ${selectedYear === y ? 'text-[var(--theme-primary)] text-lg scale-110' : 'text-[var(--theme-muted)] opacity-40'}`}
                >
                  {y}年
                </button>
              ))}
            </div>
          </div>

          {/* Month Column */}
          <div 
            ref={monthContainerRef}
            className="flex-1 h-48 overflow-y-auto hide-scrollbar snap-y snap-mandatory bg-[var(--theme-bg)] rounded-3xl p-2 border border-[var(--theme-secondary)]"
          >
            <div className="py-16">
              {months.map(m => (
                <button
                  key={m}
                  data-month={m}
                  onClick={() => setSelectedMonth(m)}
                  className={`w-full py-4 snap-center text-sm font-bold transition-all ${selectedMonth === m ? 'text-[var(--theme-primary)] text-lg scale-110' : 'text-[var(--theme-muted)] opacity-40'}`}
                >
                  {m + 1}月
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => onConfirm(selectedYear, selectedMonth)}
          className="w-full py-4 bg-[var(--theme-primary)] text-white rounded-2xl text-sm font-bold shadow-lg active:scale-95 transition-all"
        >
          确定并跳转
        </button>
      </div>
    </div>
  );
};
