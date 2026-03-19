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
  category: string;
  layoutType: LayoutType;
  prices?: PriceItem[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: Record<string, unknown>; // Lexical JSON
  price: number;
  category: string;
  unit: string;
  features?: {
    tulajdonság_neve: string;
    érték: string;
  }[];
  image: string;
}

export interface APIResponse {
  slides: SlideData[];
}

