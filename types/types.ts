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

export interface APIResponse {
  slides: SlideData[];
}
