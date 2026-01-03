export interface Variant {
  ram?: string; // Optional for electronics
  storage?: string; // Optional for electronics
  price: number;
  originalPrice: number;
}

export interface Specification {
  processor?: string;
  display?: string;
  battery?: string;
  camera?: string;
  bluetooth?: string;
  os?: string;
  // Generic specs for electronics
  power?: string;
  warranty?: string;
  material?: string;
  type?: string;
  color?: string;
  [key: string]: string | undefined;
}

export interface Product {
  id: string;
  category: 'mobile' | 'electronics';
  brand: string;
  model: string;
  name: string;
  images: string[];
  rating: number;
  reviewCount: number;
  variants: Variant[];
  specs: Specification;
  highlights: string[];
  isBestSeller?: boolean;
  isFeatured?: boolean;
}

export interface FilterState {
  searchQuery: string;
  brands: string[];
  minPrice: number;
  maxPrice: number;
  minRam: number; // e.g., 4, 6, 8
}
