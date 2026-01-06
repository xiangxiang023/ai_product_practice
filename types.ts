
export interface ClothingItem {
  id: string;
  name: string;
  category: string;
  color: string;
  image: string;
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
  date: string;
  weather: WeatherData;
  itemIds: string[];
  note: string;
  photo?: string;
}

export type View = 'home' | 'wardrobe' | 'calendar' | 'record' | 'report';

export interface AppTheme {
  id: string;
  name: string;
  primary: string;    // Accent color (buttons, active states)
  secondary: string;  // Light versions of primary
  background: string; // Main page background
  text: string;       // Primary text
  muted: string;      // Subtitles/labels
}
