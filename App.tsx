
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
    // Check if record for this date already exists (by simple date match)
    const recordDateStr = new Date(record.date).toDateString();
    const filteredRecords = records.filter(r => new Date(r.date).toDateString() !== recordDateStr);
    const updated = [record, ...filteredRecords];
    
    setRecords(updated);
    StorageService.saveRecords(updated);
    setView('home');
    setSelectedCalendarDate(null);
  };

  const handleCalendarDayClick = (date: Date) => {
    setSelectedCalendarDate(date);
    setView('record');
  };

  return (
    <div className="max-w-screen-md mx-auto min-h-screen relative flex flex-col bg-[#F9F8F6] text-stone-800">
      {/* Dynamic View Rendering */}
      <main className="flex-1 p-6 pb-24 overflow-y-auto">
        {view === 'home' && (
          <div className="space-y-12 py-12">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-serif tracking-tight">OOTD Note</h1>
              <p className="text-stone-400 text-xs italic tracking-widest uppercase">收纳衣橱 · 感知四季</p>
            </div>
            <BentoGrid 
              recentItems={clothes.slice(0, 4)} 
              recentRecords={records.slice(0, 3)} 
              onNavigate={setView} 
            />
            
            {/* Quick Action */}
            <div className="flex justify-center pt-8">
               <button 
                 onClick={() => { setSelectedCalendarDate(null); setView('record'); }}
                 className="px-10 py-5 bg-stone-800 text-white rounded-[32px] shadow-2xl hover:scale-105 active:scale-95 transition-all font-medium flex items-center space-x-3"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                 <span className="tracking-wide">记录今日</span>
               </button>
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

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-screen-md mx-auto bg-white/70 backdrop-blur-xl border-t border-stone-100 px-10 py-5 flex justify-around items-center z-40">
        <button onClick={() => setView('home')} className={`p-2 transition-all ${view === 'home' ? 'text-stone-800 scale-110' : 'text-stone-300'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
        </button>
        <button onClick={() => setView('wardrobe')} className={`p-2 transition-all ${view === 'wardrobe' ? 'text-stone-800 scale-110' : 'text-stone-300'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </button>
        <button onClick={() => setView('calendar')} className={`p-2 transition-all ${view === 'calendar' ? 'text-stone-800 scale-110' : 'text-stone-300'}`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>
        </button>
        <button onClick={() => StorageService.exportData()} className="p-2 text-stone-300 hover:text-stone-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
        </button>
      </nav>

      {/* Overlays */}
      {view === 'record' && (
        <RecordToday 
          clothes={clothes} 
          onSave={handleSaveRecord} 
          onCancel={() => { setView('home'); setSelectedCalendarDate(null); }}
          initialDate={selectedCalendarDate || undefined}
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
