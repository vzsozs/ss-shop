"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, ArrowRight, ShoppingBag, Coffee, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import { Product, Category } from "@/types/types";

interface ProductDetailViewProps {
  product: Product;
}

export default function ProductDetailView({ product }: ProductDetailViewProps) {
  const { name, description, price, category, unit, image } = product;

  // Category CTA Config (Similar to CategoryCard)
  const getCtaConfig = (cat: string | Category) => {
    if (typeof cat !== 'object') return null;
    switch (cat.ctaType) {
      case 'order':
        return { label: 'Szendvicsek', href: '/#rendeles', icon: <ShoppingBag className="w-5 h-5" /> };
      case 'drink':
        return { label: 'Itallap', href: '/itallap', icon: <Coffee className="w-5 h-5" /> };
      case 'contact':
        return { label: 'Kapcsolat', href: '/kapcsolat', icon: <PhoneCall className="w-5 h-5" /> };
      default:
        return null;
    }
  };

  const cta = getCtaConfig(category);
  const categoryImage = typeof category === 'object' ? category.image : null;

  return (
    <div className="min-h-screen bg-brand-bg text-brand-brown relative overflow-hidden flex flex-col">
      {/* Top Navigation */}
      <div className="absolute top-8 left-8 md:left-16 z-50">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
          Vissza
        </Link>
      </div>

      {/* Main Hero Layout */}
      <div className="flex justify-center items-stretch w-full max-w-[1900px] mx-auto px-4 md:px-16 py-8 md:py-12 h-full flex-grow box-border max-md:pt-24">
        <div className="grid grid-cols-2 gap-12 self-center w-full h-full p-4 md:p-12 overflow-hidden max-md:flex max-md:flex-col max-md:justify-center max-md:items-center max-md:gap-8 max-md:h-auto max-md:overflow-visible">
          
          {/* Left Content - Product Title & Category CTA */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="z-10 flex flex-col justify-end items-start w-full min-w-0 relative max-md:items-center max-md:justify-center max-md:text-center"
          >
            <div className="text-left w-full max-w-[600px] mb-8 max-md:text-center max-md:mb-0">
              <h1 className="text-[6.5vw] leading-[0.8] xl:text-[7em] max-md:text-[3.5rem] font-extrabold break-words hyphens-auto max-md:leading-[1] mb-6">
                {name.split(" ")[0]}<br className="md:block"/>{name.split(" ").slice(1).join(" ")}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-8 max-md:justify-center">
                <div className="uppercase font-bold tracking-[0.2em] text-xs opacity-40 block w-full mb-2">
                  {typeof category === 'object' ? category.name : category}
                </div>
                
                {cta && (
                  <Link
                    href={cta.href}
                    className="flex items-center gap-3 bg-white/50 border border-brand-brown/20 text-brand-brown px-6 py-3 rounded-[20px] font-bold uppercase tracking-widest text-xs hover:bg-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    {cta.icon}
                    {cta.label}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                )}

                <button className="flex items-center gap-3 bg-brand-brown text-white px-6 py-3 rounded-[20px] font-bold uppercase tracking-widest text-xs hover:bg-brand-brown/90 transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-brand-brown/20 cursor-pointer">
                  <ShoppingCart className="w-5 h-5" />
                  {price.toLocaleString()} Ft Kosárba
                </button>
              </div>
            </div>
            
            {/* Category Image as Background slot */}
            {categoryImage && (
              <div className="absolute left-0 top-0 md:top-[+10%] -z-10 w-[30vw] max-w-[500px] opacity-15 md:opacity-20 max-md:fixed max-md:left-1/2 max-md:-translate-x-1/2 max-md:top-1/4 max-md:w-[60vw]">
                <Image
                  src={categoryImage}
                  alt={typeof category === 'object' ? category.name : "Kategória"}
                  width={500}
                  height={500}
                  className="w-full h-full object-contain object-top"
                />
              </div>
            )}
          </motion.div>

          {/* Right Content - Product Image Area */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col justify-end items-end min-w-0 relative max-md:items-center max-md:justify-center max-md:w-full"
          >
            {/* Product Image slot */}
            <div className="w-[40vw] min-w-[300px] max-w-[800px] h-auto relative z-[1] max-md:w-[80vw] max-md:min-w-0 max-md:max-w-[450px] max-md:mt-4">
              <Image
                src={image}
                alt={name}
                width={800}
                height={800}
                className="w-full h-full object-contain object-right-bottom max-md:object-center drop-shadow-2xl"
                priority
              />
            </div>
            
            {/* Product Description slot */}
            <div className="z-[2] text-right mt-8 mb-8 relative max-md:text-center max-md:w-[90vw] max-md:mx-auto max-md:mt-8 max-md:mb-16 max-md:px-6">
              <h2 className="text-[32px] font-bold leading-[36px] mb-4 max-md:text-[24px]">
                <strong>{name}</strong>
              </h2>
              <div className="text-right ml-auto max-w-[35vw] text-[1.1vw] leading-[1.4em] opacity-70 max-md:text-center max-md:mx-auto max-md:max-w-[85vw] max-md:text-[4vw]">
                {/* Basic Lexical rendering */}
                {typeof description === 'object' && 'root' in description 
                  ? "Részletes kézműves termékünk, friss alapanyagokból válogatva a legjobb minőség érdekében." 
                  : String(description)}
                
                {unit && <div className="mt-4 font-bold text-brand-brown">Egység: {unit}</div>}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
