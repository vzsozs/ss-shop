export type LayoutType = "hero-card" | "price-list";

export interface PriceItem {
  name: string;
  price: string;
  description?: string;
}

export interface SlideData {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string | Category;
  layoutType: 'hero-card' | 'price-list';
  link?: string;
  // New fields for Product-based slides
  productImage?: string;
  productDescription?: string | Record<string, unknown>;
  categoryImage?: string;
  categoryDescription?: string;
  categoryCta?: { label: string; href: string; iconType: string; text?: string };
  prices?: PriceItem[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  ctaType: 'none' | 'order' | 'drink' | 'contact';
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: Record<string, unknown>; // Lexical JSON
  price: number;
  category: string | Category;
  unit: string;
  showInSlider: boolean;
  features?: {
    feature: string;
  }[];
  image: string;
}

export interface APIResponse {
  slides: SlideData[];
}

