import { SlideData, Product, Category } from "@/types/types";
import { getPayload } from 'payload'
import config from '@/payload.config'
import content from "@/data/content.json";

const mapImageUrl = (image: unknown): string => {
  if (typeof image === 'object' && image !== null) {
    const url = String((image as Record<string, unknown>).url || '');
    return url.replace('/api/media/file/', '/media/');
  }
  return String(image || '').replace('/api/media/file/', '/media/');
};

const mapCategory = (cat: unknown): string | Category => {
  if (typeof cat === 'object' && cat !== null && 'id' in cat) {
    const c = cat as Record<string, unknown>;
    return {
      id: String(c.id),
      name: String(c.name),
      image: mapImageUrl(c.image),
      ctaType: (c.ctaType as Category['ctaType']) || 'none',
    };
  }
  return String(cat || '');
};

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
      console.log("Adatforrás: Payload CMS");
      
      // Map Payload docs to SlideData structure
      return (docs as Record<string, unknown>[]).map((doc) => ({
        id: String(doc.id),
        name: String(doc.name),
        description: String(doc.description),
        image: mapImageUrl(doc.image),
        category: mapCategory(doc.category),
        layoutType: doc.layoutType as SlideData["layoutType"],
        prices: Array.isArray(doc.prices) ? doc.prices.map((p: Record<string, unknown>) => ({
          name: String(p.name),
          price: String(p.price),
          description: p.description ? String(p.description) : undefined
        })) : undefined
      }));
    }
    
    console.log("Adatforrás: JSON fallback");
    return content as SlideData[];
  } catch {
    console.log("Adatforrás: JSON fallback (Payload nem érhető el)");
    return content as SlideData[];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        archived: {
          not_equals: true,
        },
      },
      depth: 1,
    })

    return (docs as Record<string, unknown>[]).map((doc) => ({
      id: String(doc.id),
      name: String(doc.name),
      slug: String(doc.slug),
      description: doc.description as Record<string, unknown>,
      price: Number(doc.price),
      category: mapCategory(doc.category),
      unit: String(doc.unit),
      archived: Boolean(doc.archived),
      features: Array.isArray(doc.features) ? (doc.features as Record<string, unknown>[]).map((f) => ({
        tulajdonság_neve: String(f.tulajdonság_neve),
        érték: String(f.érték)
      })) : undefined,
      image: mapImageUrl(doc.image),
    }));
  } catch (error) {
    console.log("Hiba a termékek lekérésekor:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 1,
      limit: 1,
    })

    if (!docs || docs.length === 0) return null;
    const doc = docs[0] as Record<string, unknown>;

    return {
      id: String(doc.id),
      name: String(doc.name),
      slug: String(doc.slug),
      description: doc.description as Record<string, unknown>,
      price: Number(doc.price),
      category: mapCategory(doc.category),
      unit: String(doc.unit),
      archived: Boolean(doc.archived),
      features: Array.isArray(doc.features) ? (doc.features as Record<string, unknown>[]).map((f) => ({
        tulajdonság_neve: String(f.tulajdonság_neve),
        érték: String(f.érték)
      })) : undefined,
      image: mapImageUrl(doc.image),
    };
  } catch (error) {
    console.log(`Hiba a termék (${slug}) lekérésekor:`, error);
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'categories',
      depth: 1,
    })

    return (docs as Record<string, unknown>[]).map((doc) => ({
      id: String(doc.id),
      name: String(doc.name),
      image: mapImageUrl(doc.image),
      ctaType: (doc.ctaType as Category['ctaType']) || 'none',
    }));
  } catch (error) {
    console.log("Hiba a kategóriák lekérésekor:", error);
    return [];
  }
}


