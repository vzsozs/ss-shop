"use client";

import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/types";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Coffee, PhoneCall } from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const { name, description, image, ctaType } = category;

  const getCtaConfig = () => {
    switch (ctaType) {
      case 'order':
        return {
          label: 'Szendvicsek',
          href: '/#rendeles',
          icon: <ShoppingBag className="w-5 h-5" />,
        };
      case 'drink':
        return {
          label: 'Itallap',
          href: '/itallap',
          icon: <Coffee className="w-5 h-5" />,
        };
      case 'contact':
        return {
          label: 'Kapcsolat',
          href: '/kapcsolat',
          icon: <PhoneCall className="w-5 h-5" />,
        };
      default:
        return null;
    }
  };

  const cta = getCtaConfig();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="group relative h-[400px] rounded-[40px] overflow-hidden bg-brand-bg shadow-lg hover:shadow-2xl transition-all duration-500"
    >
      {/* Background Image */}
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-brown/80 via-brand-brown/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <h3 className="text-3xl font-black text-white mb-2 transform transition-transform duration-500 group-hover:-translate-y-2">
          {name}
        </h3>
        <p className="text-white/70 text-sm mb-6 line-clamp-2 transform transition-all duration-500 group-hover:-translate-y-2 delay-75">
          {description}
        </p>
        
        {cta && (
          <Link
            href={cta.href}
            className="inline-flex items-center gap-3 bg-white text-brand-brown px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-brand-brown hover:text-white transition-all transform hover:scale-105 active:scale-95 w-fit"
          >
            {cta.icon}
            {cta.label}
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
