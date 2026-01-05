
import { ClothingItem, OOTDRecord } from '../types';

const KEYS = {
  CLOTHES: 'ootd_clothes',
  RECORDS: 'ootd_records'
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
  exportData: () => {
    const data = {
      clothes: StorageService.getClothes(),
      records: StorageService.getRecords()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ootd_note_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }
};
