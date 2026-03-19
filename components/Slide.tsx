"use client";

import { SlideData } from "@/types/types";
import HeroCard from "./HeroCard";
import PriceList from "./PriceList";

const LAYOUT_MAP: Record<string, React.ComponentType<{ data: SlideData }>> = {
  "hero-card": HeroCard,
  "price-list": PriceList,
};

function DefaultFallback({ data }: { data: SlideData }) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center bg-brand-bg opacity-80">
      <h2 className="text-2xl font-bold mb-4">{data.name}</h2>
      <p>{data.description}</p>
    </div>
  );
}

interface SlideProps {
  data: SlideData;
}

export default function Slide({ data }: SlideProps) {
  if (!data || !data.layoutType) {
    console.warn("Skipping slide due to missing layoutType:", data);
    return null;
  }

  const Component = LAYOUT_MAP[data.layoutType] || DefaultFallback;
  
  return (
    <div className="w-full h-full relative overflow-hidden">
      <Component data={data} />
    </div>
  );
}
