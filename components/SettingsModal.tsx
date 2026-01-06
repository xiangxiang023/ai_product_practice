
import React from 'react';
import { AppTheme } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  themes: AppTheme[];
  currentThemeId: string;
  onThemeChange: (id: string) => void;
  onOpenReport: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  onClose, 
  themes, 
  currentThemeId, 
  onThemeChange, 
  onOpenReport 
}) => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm overflow-hidden flex flex-col animate-in zoom-in duration-300 rounded-[2.5rem] shadow-2xl border border-[#F2EBE3]">
        <header className="px-8 py-6 border-b border-[#FFFBF5] flex justify-between items-center">
          <h2 className="text-base font-bold text-[var(--theme-primary)] tracking-tight">应用设置</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FFFBF5] transition-colors">
            <svg className="w-5 h-5 text-[var(--theme-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 hide-scrollbar">
          {/* Theme Selector */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-[var(--theme-muted)] uppercase tracking-widest ml-1">风格色调</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onThemeChange(theme.id)}
                  className={`flex items-center space-x-3 p-3 rounded-2xl border transition-all ${
                    currentThemeId === theme.id 
                    ? 'border-[var(--theme-primary)] bg-[var(--theme-secondary)]' 
                    : 'border-[var(--theme-secondary)] bg-white'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full border border-white shadow-sm" style={{ backgroundColor: theme.primary }} />
                  <span className="text-xs font-bold" style={{ color: currentThemeId === theme.id ? theme.primary : '#4A3F35' }}>
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Export Options */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-[var(--theme-muted)] uppercase tracking-widest ml-1">数据存档</h3>
            <button 
              onClick={onOpenReport}
              className="w-full py-5 bg-white border-2 border-dashed border-[var(--theme-secondary)] rounded-3xl flex flex-col items-center justify-center group active:scale-95 transition-all hover:border-[var(--theme-primary)]"
            >
              <div className="w-12 h-12 bg-[var(--theme-secondary)] rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-[var(--theme-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <p className="text-sm font-bold text-[var(--theme-text)]">生成穿搭简报</p>
              <p className="text-[9px] text-[var(--theme-muted)] mt-1">导出 PDF 格式以便查阅</p>
            </button>
          </section>
        </div>

        <footer className="p-8 pt-0">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-[var(--theme-primary)] text-white text-xs font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            返回应用
          </button>
        </footer>
      </div>
    </div>
  );
};
