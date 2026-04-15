export type SnackCategory = 'popcorn' | 'drinks' | 'combos' | 'sweets' | 'extras';

export interface SnackOption {
  label: string;   // e.g. 'Tamaño'
  choices: string[]; // e.g. ['Pequeño','Mediano','Grande']
}

export interface Snack {
  id: string;
  name: string;
  description: string;
  category: SnackCategory;
  price: number;
  image: string | null;
  status: 'active' | 'inactive';
  options?: SnackOption[];
}
