import { SlideData } from "@/types/types";
import { getPayload } from 'payload'
import config from '@/payload.config'
import content from "@/data/content.json";

export async function getSlidesData(): Promise<SlideData[]> {
  console.log("Fetching data...");
  
  try {
    const payload = await getPayload({ config })
    
    // Fetch slides from Payload
    const { docs } = await payload.find({
      collection: 'slides',
      depth: 1, // Ensure we get the full media object
    })

    if (docs && docs.length > 0) {
      console.log("Data fetched from Payload CMS");
      
      // Map Payload docs to SlideData structure
      return (docs as any[]).map((doc) => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        image: typeof doc.image === 'object' ? doc.image.url : doc.image,
        category: doc.category,
        layoutType: doc.layoutType,
        prices: doc.prices?.map((p: any) => ({
          name: p.name,
          price: p.price,
          description: p.description
        }))
      })) as SlideData[];
    }
    
    console.log("Payload collection empty, falling back to JSON");
    return content as SlideData[];
  } catch (error) {
    console.error("Payload not available or error occurred, falling back to JSON:", error);
    return content as SlideData[];
  }
}
