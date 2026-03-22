import { SlideData, Product, Category } from "@/types/types";
import { getPayload } from 'payload'
import config from '@/payload.config'
import content from "@/data/content.json";

const mapImageUrl = (image: unknown): string => {
  if (typeof image === 'object' && image !== null) {
    const url = String((image as Record<string, unknown>).url || '');
    if (url.startsWith('/') || url.startsWith('http')) {
      return url.replace('/api/media/file/', '/media/');
    }
  }
  const str = String(image || '');
  if (str.startsWith('/') || str.startsWith('http')) {
    return str.replace('/api/media/file/', '/media/');
  }
  // Fallback for IDs or missing images
  return '/media/placeholder.png'; 
};

const mapCategory = (cat: unknown): string | Category => {
  if (typeof cat === 'object' && cat !== null && 'id' in cat) {
    const c = cat as Record<string, unknown>;
    return {
      id: String(c.id),
      name: String(c.name),
      description: String(c.description),
      image: mapImageUrl(c.image),
      ctaType: (c.ctaType as Category['ctaType']) || 'none',
    };
  }
  return String(cat || '');
};

export async function getSlidesData(): Promise<SlideData[]> {
  try {
    const payload = await getPayload({ config })
    
    // 1. Fetch products marked for slider
    const { docs: productDocs } = await payload.find({
      collection: 'products',
      where: {
        and: [
          { showInSlider: { equals: true } }
        ]
      },
      depth: 2,
    })

    // 2. Fetch "Étlapok" (from menu-slides collection)
    const { docs: menuDocs } = await payload.find({
      collection: 'menu-slides',
      where: {
        or: [
          { showOnHomepage: { equals: true } },
          { showOnHomepage: { exists: false } }
        ]
      },
      depth: 2,
    })

    const productSlides = (productDocs as Record<string, unknown>[]).map((doc) => {
      const cat = doc.category as Record<string, unknown> | null;
      
      // Helper for CTA
      const getCta = (c: Record<string, unknown> | null) => {
        if (!c) return undefined;
        const type = String(c.ctaType);
        if (type === 'none') return undefined;
        
        let label = 'Megnézem';
        let href = '/';
        let text = 'Nézd meg kínálatunkat:';
        
        if (type === 'order') { 
          text = 'Kapd el a nap ízét';
          label = 'Szendvicseink'; 
          href = '/#rendeles'; 
        }
        if (type === 'drink') { 
          text = 'Szomjas vagy?';
          label = 'Itallap'; 
          href = '/itallap'; 
        }
        if (type === 'contact') { 
          text = 'Kérdésed van valamilyen rendezvény kapcsán?';
          label = 'Kapcsolat'; 
          href = '/kapcsolat'; 
        }
        
        return { label, href, iconType: type, text };
      };

      return {
        id: `prod-${doc.id}`,
        name: String(doc.name),
        description: "", // HeroCard will use productDescription instead
        image: mapImageUrl(doc.image), // Main image (fallback)
        category: mapCategory(doc.category),
        layoutType: 'hero-card' as const,
        link: `/termek/${doc.slug}`, // Keep for backward compatibility or future use
        
        // New split fields
        productImage: mapImageUrl(doc.image),
        productDescription: doc.description as Record<string, unknown>,
        categoryImage: cat ? mapImageUrl(cat.image) : undefined,
        categoryDescription: cat ? String(cat.description) : undefined,
        categoryCta: getCta(cat),
      };
    });

    const menuSlides = (menuDocs as Record<string, unknown>[]).map((doc) => {
      const cat = doc.category as Record<string, unknown> | null;
      let categoryName = String(doc.category || '');
      if (cat && typeof cat === 'object') {
        categoryName = String(cat.name || '');
      }

      return {
        id: `menu-${doc.id}`,
        name: String(doc.name),
        description: String(doc.description),
        image: mapImageUrl(doc.backgroundImage),
        category: categoryName,
        layoutType: 'price-list' as const,
        prices: Array.isArray(doc.prices) ? doc.prices.map((p: Record<string, unknown>) => {
          const productDoc = p.product as Record<string, unknown> | null;
          return {
            name: String(p.name),
            price: String(p.price),
            description: p.description ? String(p.description) : undefined,
            product: productDoc ? {
              id: String(productDoc.id),
              name: String(productDoc.name),
              slug: String(productDoc.slug),
            } : undefined
          };
        }) : undefined,
        showOnHomepage: Boolean(doc.showOnHomepage)
      };
    });

    return [...productSlides, ...menuSlides];
    
  } catch (error) {
    console.log("Hiba a diák lekérésekor, fallback a JSON-ra:", error);
    return content as SlideData[];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'products',
      where: {
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
      showInSlider: Boolean(doc.showInSlider),
      features: Array.isArray(doc.features) ? (doc.features as Record<string, unknown>[]).map((f) => ({
        feature: String(f.feature),
        value: String(f.value || '')
      })) : undefined,
      ingredients: Array.isArray(doc.ingredients) ? (doc.ingredients as Record<string, unknown>[]).map((i) => ({
        name: String(i.name)
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
      showInSlider: Boolean(doc.showInSlider),
      features: Array.isArray(doc.features) ? (doc.features as Record<string, unknown>[]).map((f) => ({
        feature: String(f.feature),
        value: String(f.value || '')
      })) : undefined,
      ingredients: Array.isArray(doc.ingredients) ? (doc.ingredients as Record<string, unknown>[]).map((i) => ({
        name: String(i.name)
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
      description: String(doc.description),
      image: mapImageUrl(doc.image),
      ctaType: (doc.ctaType as Category['ctaType']) || 'none',
    }));
  } catch (error) {
    console.log("Hiba a kategóriák lekérésekor:", error);
    return [];
  }
}


