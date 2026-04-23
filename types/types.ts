export type LayoutType = "hero-card" | "price-list";

export interface PriceItem {
  name: string;
  price: string;
  description?: string;
  subcategory?: string;
  product?: string | { id: string; name: string; slug: string; showInSlider?: boolean } | Product;
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
  showOnHomepage?: boolean;
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
    value: string;
  }[];
  ingredients?: {
    name: string;
  }[];
  image: string;
}

export interface APIResponse {
  slides: SlideData[];
}

