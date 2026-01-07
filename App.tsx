
import React, { useState, useEffect, useMemo } from 'react';
import { View, ClothingItem, OOTDRecord, AppTheme } from './types';
import { StorageService } from './services/storage';
import { BentoGrid } from './components/BentoGrid';
import { Wardrobe } from './components/Wardrobe';
import { CalendarView } from './components/CalendarView';
import { RecordToday } from './components/RecordToday';
import { AddClothingModal } from './components/AddClothingModal';
import { SettingsModal } from './components/SettingsModal';
import { StyleReport } from './components/StyleReport';

const THEMES: AppTheme[] = [
  { id: 'classic', name: '经典暖咖', primary: '#8D7B68', secondary: '#F2EBE3', background: '#FFFBF5', text: '#4A3F35', muted: '#A79277' },
  { id: 'morandi-blue', name: '莫兰迪蓝', primary: '#7C93A0', secondary: '#E3E9ED', background: '#F4F7F8', text: '#3E4A52', muted: '#8EA0AB' },
  { id: 'sage-green', name: '豆蔻青', primary: '#94A684', secondary: '#E9EDDF', background: '#F7F8F4', text: '#434A3E', muted: '#A0B091' },
  { id: 'macaron-pink', name: '落日粉', primary: '#D4A5A5', secondary: '#F6EEEE', background: '#FFF9F9', text: '#523E3E', muted: '#B89090' },
  { id: 'lavender', name: '丁香紫', primary: '#A594F9', secondary: '#EFEDFF', background: '#F9F8FF', text: '#3E3A52', muted: '#948DBB' }
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [records, setRecords] = useState<OOTDRecord[]>([]);
  const [currentThemeId, setCurrentThemeId] = useState<string>(StorageService.getTheme() || 'classic');
  const [isAddingClothing, setIsAddingClothing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [activeRecord, setActiveRecord] = useState<OOTDRecord | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const currentTheme = useMemo(() => 
    THEMES.find(t => t.id === currentThemeId) || THEMES[0]
  , [currentThemeId]);

  useEffect(() => {
    const initData = async () => {
      const storedClothes = await StorageService.getClothes();
      const storedRecords = await StorageService.getRecords();
      setClothes(storedClothes);
      setRecords(storedRecords);
      setIsLoading(false);
    };
    initData();
  }, []);

  const handleAddClothes = async (item: ClothingItem) => {
    await StorageService.saveClothing(item);
    const updated = await StorageService.getClothes();
    setClothes(updated);
    setIsAddingClothing(false);
    setView('wardrobe'); 
  };

  const handleDeleteItem = async (id: string) => {
    await StorageService.deleteClothing(id);
    const updated = await StorageService.getClothes();
    setClothes(updated);
  };

  const handleSaveRecord = async (record: OOTDRecord) => {
    await StorageService.saveRecord(record);
    const updated = await StorageService.getRecords();
    setRecords(updated);
    setView('calendar');
    setSelectedCalendarDate(null);
    setActiveRecord(undefined);
  };

  const handleDeleteRecord = async (id: string) => {
    await StorageService.deleteRecord(id);
    const updated = await StorageService.getRecords();
    setRecords(updated);
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

  const handleThemeChange = (id: string) => {
    setCurrentThemeId(id);
    StorageService.saveTheme(id);
  };

  const themeStyles = {
    '--theme-primary': currentTheme.primary,
    '--theme-secondary': currentTheme.secondary,
    '--theme-bg': currentTheme.background,
    '--theme-text': currentTheme.text,
    '--theme-muted': currentTheme.muted,
  } as React.CSSProperties;

  if (isLoading) {
    return (
      <div style={themeStyles} className="flex items-center justify-center min-h-screen bg-[var(--theme-bg)]">
        <div className="animate-pulse text-[var(--theme-primary)] font-bold tracking-widest text-lg">OOTD Note...</div>
      </div>
    );
  }

  return (
    <div style={themeStyles} className="max-w-screen-md mx-auto min-h-screen relative flex flex-col bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors duration-500">
      <style>{`
        input[type=range]::-webkit-slider-thumb { background: var(--theme-primary); }
        .text-primary { color: var(--theme-primary); }
        .bg-primary { background-color: var(--theme-primary); }
        .border-primary { border-color: var(--theme-primary); }
        .bg-secondary { background-color: var(--theme-secondary); }
        .border-secondary { border-color: var(--theme-secondary); }
      `}</style>

      <main className="flex-1 p-6 pb-28 overflow-y-auto hide-scrollbar">
        {view === 'home' && (
          <div className="space-y-12 py-12">
            <header className="relative">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="absolute top-0 right-0 p-3 bg-white/50 backdrop-blur rounded-2xl border border-[var(--theme-secondary)] active:scale-90 transition-all shadow-sm"
              >
                <svg className="w-5 h-5 text-[var(--theme-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
              
              <div className="space-y-2 text-center pt-8">
                <h1 className="text-4xl font-bold tracking-tight text-[var(--theme-primary)]">OOTD Note</h1>
                <p className="text-[var(--theme-muted)] text-sm font-medium tracking-widest">穿搭日常 / 感知四季</p>
              </div>
            </header>
            
            <BentoGrid 
              recentItems={clothes.slice(0, 4)} 
              recentRecords={records.slice(0, 3)} 
              onNavigate={setView} 
            />
            
            <div className="flex flex-col items-center space-y-4 pt-4">
               <button 
                 onClick={() => { setSelectedCalendarDate(null); setActiveRecord(undefined); setView('record'); }}
                 className="w-20 h-20 bg-[var(--theme-primary)] text-white rounded-[2.5rem] shadow-lg active:scale-95 transition-all flex items-center justify-center hover:opacity-90"
               >
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
               </button>
               <p className="text-xs font-bold text-[var(--theme-muted)] uppercase tracking-widest">记录今日</p>
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

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm bg-white/90 backdrop-blur-md rounded-[2rem] warm-shadow px-8 py-4 flex justify-around items-center z-40 border border-[var(--theme-secondary)]">
        <button onClick={() => setView('wardrobe')} className={`p-2 transition-all rounded-xl ${view === 'wardrobe' ? 'bg-[var(--theme-secondary)] text-[var(--theme-primary)] scale-110' : 'text-[var(--theme-muted)] active:scale-90'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </button>
        <button onClick={() => setView('home')} className={`p-2 transition-all rounded-xl ${view === 'home' ? 'bg-[var(--theme-secondary)] text-[var(--theme-primary)] scale-110' : 'text-[var(--theme-muted)] active:scale-90'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
        </button>
        <button onClick={() => setView('calendar')} className={`p-2 transition-all rounded-xl ${view === 'calendar' ? 'bg-[var(--theme-secondary)] text-[var(--theme-primary)] scale-110' : 'text-[var(--theme-muted)] active:scale-90'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
        </button>
      </nav>

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

      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => setIsSettingsOpen(false)}
          themes={THEMES}
          currentThemeId={currentThemeId}
          onThemeChange={handleThemeChange}
          onOpenReport={() => { setView('report'); setIsSettingsOpen(false); }}
        />
      )}

      {view === 'report' && (
        <StyleReport 
          clothes={clothes} 
          records={records} 
          onClose={() => setView('home')} 
        />
      )}
    </div>
  );
};

export default App;
