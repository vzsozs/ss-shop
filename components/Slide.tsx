"use client";

import { SlideData, LayoutType } from "@/types/types";
import HeroCard from "./HeroCard";
import PriceList from "./PriceList";

const LAYOUT_MAP: Record<LayoutType, React.ComponentType<{ data: SlideData }>> = {
  "hero-card": HeroCard,
  "price-list": PriceList,
};

interface SlideProps {
  data: SlideData;
}

export default function Slide({ data }: SlideProps) {
  if (!data || !data.layoutType) {
    console.warn("Skipping slide due to missing layoutType:", data);
    return null;
  }

  const Component = LAYOUT_MAP[data.layoutType] || HeroCard;
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      <Component data={data} />
    </div>
  );
}
