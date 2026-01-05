
export interface ClothingItem {
  id: string;
  name: string;
  category: string; // Changed from enum to string for custom input
  color: string;    // Changed from hex-only to string for custom input
  image: string;    // Base64 or URL
  brand?: string;
  price?: number;
  createdAt: number;
}

export interface WeatherData {
  condition: string;
  temp: number;
  icon: string;
}

export interface OOTDRecord {
  id: string;
  date: string; // ISO String
  weather: WeatherData;
  itemIds: string[];
  note: string;
  photo?: string; // Optional direct photo of the outfit
}

export type View = 'home' | 'wardrobe' | 'calendar' | 'record';
