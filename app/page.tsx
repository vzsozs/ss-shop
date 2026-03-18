import HomeClient from "@/components/HomeClient";
import { getSlidesData } from "@/lib/content";

export default async function Home() {
  const slides = await getSlidesData();

  return <HomeClient slides={slides} />;
}
