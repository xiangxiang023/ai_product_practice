
import React from 'react';
import { ClothingItem, OOTDRecord } from '../types';

interface StyleReportProps {
  clothes: ClothingItem[];
  records: OOTDRecord[];
  onClose: () => void;
}

export const StyleReport: React.FC<StyleReportProps> = ({ clothes, records, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-[200] flex flex-col overflow-y-auto animate-in fade-in duration-500 print:relative print:p-0">
      <header className="sticky top-0 p-6 bg-white/80 backdrop-blur-md flex justify-between items-center z-10 border-b border-gray-50 print:hidden">
        <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-gray-500">
          退出预览
        </button>
        <h1 className="text-sm font-bold tracking-widest text-gray-800">穿搭报告预览</h1>
        <button onClick={handlePrint} className="px-4 py-2 bg-black text-white rounded-full text-xs font-bold shadow-lg">
          导出 PDF / 打印
        </button>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full p-8 md:p-12 space-y-16">
        {/* Report Header */}
        <section className="text-center space-y-4 py-12 border-b border-gray-100">
          <h2 className="text-4xl font-serif italic text-gray-900">OOTD Style Archive</h2>
          <div className="flex flex-col items-center space-y-1">
             <p className="text-xs uppercase tracking-[0.3em] text-gray-400 font-bold">Personal Wardrobe Report</p>
             <p className="text-[10px] text-gray-400">{new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })} 生成</p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl font-light text-gray-900">{clothes.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">衣橱单品</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-light text-gray-900">{records.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">穿搭日志</p>
          </div>
        </section>

        {/* Wardrobe Summary */}
        <section className="space-y-8">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-l-4 border-black pl-4">我的衣橱 / My Closet</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
            {clothes.map(item => (
              <div key={item.id} className="space-y-2">
                <div className="aspect-[3/4] rounded-lg bg-gray-50 overflow-hidden border border-gray-100">
                  <img src={item.image} className="w-full h-full object-cover" />
                </div>
                <div className="px-1">
                  <p className="text-[10px] font-bold text-gray-800 truncate">{item.name}</p>
                  <p className="text-[8px] text-gray-400 uppercase tracking-tighter">{item.category} · {item.color}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Journal Summary */}
        <section className="space-y-8 pb-24">
          <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 border-l-4 border-black pl-4">穿搭日记 / Journal Records</h3>
          <div className="space-y-12">
            {records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
              <div key={record.id} className="flex flex-col md:flex-row gap-6 pb-12 border-b border-gray-50 last:border-0">
                <div className="w-full md:w-48 shrink-0">
                  <div className="aspect-square rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 mb-4">
                    {record.photo ? (
                      <img src={record.photo} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-wrap gap-0.5 p-0.5 bg-gray-100">
                        {record.itemIds.slice(0, 4).map(id => (
                          <img key={id} src={clothes.find(c => c.id === id)?.image} className="w-[calc(50%-1px)] h-[calc(50%-1px)] object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-900">{new Date(record.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}</p>
                    <p className="text-[10px] text-gray-400">{record.weather.icon} {record.weather.condition} {record.weather.temp}°C</p>
                  </div>
                </div>
                <div className="flex-1">
                   <p className="text-sm leading-relaxed text-gray-700 font-light italic">
                      "{record.note || '这一天云淡风轻。'}"
                   </p>
                   <div className="mt-6 flex flex-wrap gap-2">
                      {record.itemIds.map(id => {
                        const item = clothes.find(c => c.id === id);
                        return item ? (
                          <span key={id} className="text-[8px] bg-gray-50 text-gray-500 px-2 py-1 rounded-full border border-gray-100">
                             {item.name}
                          </span>
                        ) : null;
                      })}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="text-center py-12 border-t border-gray-100 print:block">
           <p className="text-[9px] text-gray-300 tracking-widest font-bold">OOTD NOTE STYLE ARCHIVE · MADE WITH LOVE</p>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 20mm; }
          .print\\:hidden { display: none !important; }
          body { background: white; }
          .warm-shadow { box-shadow: none !important; }
        }
      `}} />
    </div>
  );
};
