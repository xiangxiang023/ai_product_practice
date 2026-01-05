
import React from 'react';

export const COLORS = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Soft Beige', hex: '#F5F5DC' },
  { name: 'Oatmeal', hex: '#E5D3B3' },
  { name: 'Taupe', hex: '#8B8589' },
  { name: 'Charcoal', hex: '#36454F' },
  { name: 'Ink Black', hex: '#000000' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Sage Green', hex: '#B2AC88' },
  { name: 'Terracotta', hex: '#E2725B' },
  { name: 'Dusty Rose', hex: '#DCAE96' },
];

// Fixed: Category enum was removed from types.ts, so we use a static list for default categories
export const CATEGORIES = ['上装', '下装', '连衣裙', '外套', '鞋子', '配饰'];

export const ICON_WEATHER: Record<string, React.ReactNode> = {
  Sunny: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728L5.121 5.121M19 12a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Cloudy: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
  Rainy: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17l-4 4m0 0l-4-4m4 4V3" /></svg>,
};
