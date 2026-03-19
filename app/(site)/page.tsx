import HomeClient from "@/components/HomeClient";
import { getSlidesData } from "@/lib/content";
import { SlideData } from "@/types/types";

export default async function Home() {
  let slides: SlideData[] = [];
  try {
    slides = await getSlidesData();
    console.log(`Successfully fetched ${slides.length} slides.`);
  } catch {
    // Fallback happens in getSlidesData already, but we ensure list is array here
    slides = [];
  }

  return <HomeClient slides={slides} />;
}
