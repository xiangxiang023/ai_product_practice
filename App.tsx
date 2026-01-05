
import React, { useState, useEffect } from 'react';
import { View, ClothingItem, OOTDRecord } from './types';
import { StorageService } from './services/storage';
import { BentoGrid } from './components/BentoGrid';
import { Wardrobe } from './components/Wardrobe';
import { CalendarView } from './components/CalendarView';
import { RecordToday } from './components/RecordToday';
import { AddClothingModal } from './components/AddClothingModal';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [records, setRecords] = useState<OOTDRecord[]>([]);
  const [isAddingClothing, setIsAddingClothing] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [activeRecord, setActiveRecord] = useState<OOTDRecord | undefined>(undefined);

  useEffect(() => {
    setClothes(StorageService.getClothes());
    setRecords(StorageService.getRecords());
  }, []);

  const handleAddClothes = (item: ClothingItem) => {
    const updated = [item, ...clothes];
    setClothes(updated);
    StorageService.saveClothes(updated);
    setIsAddingClothing(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = clothes.filter(i => i.id !== id);
    setClothes(updated);
    StorageService.saveClothes(updated);
  };

  const handleSaveRecord = (record: OOTDRecord) => {
    const recordDateStr = new Date(record.date).toDateString();
    const filteredRecords = records.filter(r => new Date(r.date).toDateString() !== recordDateStr);
    const updated = [record, ...filteredRecords];
    
    setRecords(updated);
    StorageService.saveRecords(updated);
    setView('calendar');
    setSelectedCalendarDate(null);
    setActiveRecord(undefined);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    StorageService.saveRecords(updated);
    setView('calendar');
    setActiveRecord(undefined);
    setSelectedCalendarDate(null);
  };

  const handleCalendarDayClick = (date: Date) => {
    const recordDateStr = date.toDateString();
    const existing = records.find(r => new Date(r.date).toDateString() === recordDateStr);
    
    setSelectedCalendarDate(date);
    setActiveRecord(existing);
    setView('record');
  };

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toLocaleString(),
      wardrobeCount: clothes.length,
      journalCount: records.length,
      wardrobe: clothes.map(c => ({ 名称: c.name, 分类: c.category, 颜色: c.color })),
      journal: records.map(r => ({ 日期: new Date(r.date).toLocaleDateString(), 天气: `${r.weather.condition} ${r.weather.temp}°C`, 备忘: r.note }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OOTD_Style_Archive_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    alert('备份文件已成功保存到您的设备。');
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen relative flex flex-col bg-[#FFFBF5] text-[#4A3F35]">
      <main className="flex-1 p-6 pb-28 overflow-y-auto hide-scrollbar">
        {view === 'home' && (
          <div className="space-y-12 py-12">
            <div className="space-y-2 text-center">
              <h1 className="text-4xl font-bold tracking-tight text-[#8D7B68]">OOTD Note</h1>
              <p className="text-[#A79277] text-sm font-medium tracking-widest">穿搭日常 / 感知四季</p>
            </div>
            
            <BentoGrid 
              recentItems={clothes.slice(0, 4)} 
              recentRecords={records.slice(0, 3)} 
              onNavigate={setView} 
            />
            
            <div className="flex flex-col items-center space-y-4 pt-4">
               <button 
                 onClick={() => { setSelectedCalendarDate(null); setActiveRecord(undefined); setView('record'); }}
                 className="w-20 h-20 bg-[#C8AE7D] text-white rounded-[2.5rem] shadow-lg active:scale-95 transition-all flex items-center justify-center hover:bg-[#B3996A]"
               >
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
               </button>
               <p className="text-xs font-bold text-[#A79277] uppercase tracking-widest">记录今日</p>
            </div>
          </div>
        )}

        {view === 'wardrobe' && (
          <Wardrobe 
            items={clothes} 
            onAddItem={() => setIsAddingClothing(true)} 
            onDeleteItem={handleDeleteItem}
          />
        )}

        {view === 'calendar' && (
          <div className="h-full">
            <CalendarView 
              records={records} 
              clothes={clothes} 
              onDayClick={handleCalendarDayClick}
            />
          </div>
        )}
      </main>

      {/* Navigation Bar - Warm Rounded Floating Bar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm bg-white/90 backdrop-blur-md rounded-[2rem] warm-shadow px-8 py-4 flex justify-around items-center z-40 border border-[#F2EBE3]">
        <button onClick={() => setView('home')} className={`p-2 transition-all rounded-xl ${view === 'home' ? 'bg-[#F2EBE3] text-[#8D7B68] scale-110' : 'text-[#C1B094] active:scale-90'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
        <button onClick={() => setView('wardrobe')} className={`p-2 transition-all rounded-xl ${view === 'wardrobe' ? 'bg-[#F2EBE3] text-[#8D7B68] scale-110' : 'text-[#C1B094] active:scale-90'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
        <button onClick={() => setView('calendar')} className={`p-2 transition-all rounded-xl ${view === 'calendar' ? 'bg-[#F2EBE3] text-[#8D7B68] scale-110' : 'text-[#C1B094] active:scale-90'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
        <button onClick={handleExport} className="p-2 transition-all text-[#C1B094] active:scale-90 active:text-[#8D7B68]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        </button>
      </nav>

      {/* Overlays */}
      {view === 'record' && (
        <RecordToday 
          clothes={clothes} 
          onSave={handleSaveRecord} 
          onCancel={() => { setView('calendar'); setSelectedCalendarDate(null); setActiveRecord(undefined); }}
          onDelete={handleDeleteRecord}
          initialDate={selectedCalendarDate || undefined}
          existingRecord={activeRecord}
        />
      )}

      {isAddingClothing && (
        <AddClothingModal 
          onClose={() => setIsAddingClothing(false)} 
          onAdd={handleAddClothes} 
        />
      )}
    </div>
  );
};

export default App;