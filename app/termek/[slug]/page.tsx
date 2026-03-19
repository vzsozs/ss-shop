import { getProductBySlug } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingCart, CheckCircle2 } from "lucide-react";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const { name, description, price, category, unit, features, image } = product;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-brown p-4 md:p-12 lg:p-24 overflow-y-auto no-scrollbar">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Vissza a termékekhez
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Image */}
          <div className="relative aspect-square rounded-[40px] overflow-hidden bg-white/5 backdrop-blur-sm border border-brand-brown/10 p-12">
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-8 transform hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-40 mb-2 block">
                {typeof category === 'object' ? category.name : category}
              </span>
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
                {name}
              </h1>
              <div className="text-3xl font-bold bg-brand-brown text-white inline-block px-6 py-2 rounded-2xl">
                {price.toLocaleString()} Ft <span className="text-lg font-normal opacity-80">/ {unit}</span>
              </div>
            </div>

            {/* Description (Basic rendering for Lexical JSON) */}
            <div className="prose prose-stone prose-invert max-w-none mb-12">
              <p className="text-xl leading-relaxed opacity-80 italic">
                {/* Simplified Lexical rendering for demo purposes */}
                {typeof description === 'object' && 'root' in description 
                  ? "Részletes leírás hamarosan..." 
                  : String(description)}
              </p>
            </div>

            {/* Features */}
            {features && features.length > 0 && (
              <div className="mb-12">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-40 mb-6">Jellemzők</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center p-4 rounded-2xl bg-white/5 border border-brand-brown/5">
                      <CheckCircle2 className="w-5 h-5 mr-3 text-brand-brown flex-shrink-0" />
                      <div>
                        <div className="text-xs opacity-50 font-bold uppercase tracking-tighter">{feature.tulajdonság_neve}</div>
                        <div className="font-bold">{feature.érték}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="flex items-center justify-center gap-4 w-full md:w-auto px-12 py-5 bg-brand-brown text-white text-lg font-bold rounded-[25px] hover:bg-brand-brown/90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-brown/10 uppercase tracking-widest">
              <ShoppingCart className="w-6 h-6" />
              Kosárba teszem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
