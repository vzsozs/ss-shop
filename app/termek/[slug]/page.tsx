import { getProductBySlug } from "@/lib/content";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailView product={product} />;
}


