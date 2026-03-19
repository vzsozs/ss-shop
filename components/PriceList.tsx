"use client";

import { motion } from "framer-motion";
import { SlideData } from "@/types/types";

export default function PriceList({ data }: { data: SlideData }) {
  const { name, description, prices } = data;

  return (
    <div className="flex justify-center items-center w-full max-w-[1200px] mx-auto px-4 md:px-16 py-8 md:py-16 h-full box-border max-md:pt-24 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-white/5 backdrop-blur-sm border border-brand-brown/20 rounded-[40px] p-8 md:p-16 relative overflow-hidden"
      >
        <span className="absolute top-0 left-0 bg-brand-brown/40 text-white text-[10px] px-2 py-1 rounded-br-xl z-50">pub:PRICELIST_CONTAINER</span>

        <div className="absolute top-0 original-right-0 w-64 h-64 bg-brand-brown/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="mb-12 text-center md:text-left relative border border-brand-brown/20 p-4">
            <span className="absolute top-0 right-0 bg-brand-brown text-white text-[8px] px-1">pub:7/8</span>
            <h2 className="text-[3.5rem] md:text-[5rem] font-extrabold leading-[1] text-brand-brown mb-4">
              {name}
            </h2>
            <p className="text-[1.2rem] md:text-[1.5rem] opacity-70 max-w-[600px]">
              {description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
            {prices?.map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col border-b border-brand-brown/10 pb-4 group hover:border-brand-brown/30 transition-colors relative"
              >
                <span className="absolute -top-2 left-0 text-[6px] opacity-40">pub:9/10/11</span>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[1.4rem] md:text-[1.8rem] font-bold text-brand-brown/90 group-hover:text-brand-brown transition-colors">
                    {item.name}
                  </span>
                  <span className="text-[1.4rem] font-bold text-brand-brown font-mono">
                    {item.price}
                  </span>
                </div>
                {item.description && (
                  <span className="text-[1rem] opacity-60 italic">
                    {item.description}
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
