
import { ClothingItem, OOTDRecord } from '../types';

const KEYS = {
  CLOTHES: 'ootd_clothes',
  RECORDS: 'ootd_records',
  THEME: 'ootd_theme'
};

export const StorageService = {
  getClothes: (): ClothingItem[] => {
    const data = localStorage.getItem(KEYS.CLOTHES);
    return data ? JSON.parse(data) : [];
  },
  saveClothes: (clothes: ClothingItem[]) => {
    localStorage.setItem(KEYS.CLOTHES, JSON.stringify(clothes));
  },
  getRecords: (): OOTDRecord[] => {
    const data = localStorage.getItem(KEYS.RECORDS);
    return data ? JSON.parse(data) : [];
  },
  saveRecords: (records: OOTDRecord[]) => {
    localStorage.setItem(KEYS.RECORDS, JSON.stringify(records));
  },
  getTheme: (): string | null => {
    return localStorage.getItem(KEYS.THEME);
  },
  saveTheme: (themeId: string) => {
    localStorage.setItem(KEYS.THEME, themeId);
  }
};
