"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/types";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { name, slug, price, category, image, unit } = product;

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`Add to cart triggered for product:`, product);
    // Future Zustand logic: useCartStore.getState().addItem(product)
    alert(`${name} kosárba került! (Demo)`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white/5 backdrop-blur-md border border-brand-brown/10 rounded-[30px] overflow-hidden transition-all hover:border-brand-brown/30 hover:shadow-2xl hover:shadow-brand-brown/5"
    >
      <Link href={`/termek/${slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-brown/5">
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-4 left-4 bg-brand-brown text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            {typeof category === 'object' ? category.name : category}
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-brand-brown leading-tight group-hover:text-brand-brown/80 transition-colors">
              {name}
            </h3>
            <span className="text-sm opacity-40 font-medium">/{unit}</span>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-2xl font-black text-brand-brown">
              {price.toLocaleString()} <span className="text-sm font-normal">Ft</span>
            </div>
            
            <button
              onClick={addToCart}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-brown text-white transition-all transform hover:scale-110 active:scale-95 group/btn"
              title="Kosárba"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-4 flex items-center text-xs font-bold text-brand-brown/40 group-hover:text-brand-brown/70 transition-colors uppercase tracking-widest">
            Részletek megtekintése <ArrowRight className="w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
