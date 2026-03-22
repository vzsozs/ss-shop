"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { SlideData } from "@/types/types";
import { useMemo, useState, useEffect, useRef } from "react";

export default function PriceList({ 
  data, 
  internalPage = 0, 
  onInternalPageChange,
  onTotalPagesChange 
}: { 
  data: SlideData, 
  internalPage?: number,
  onInternalPageChange?: (page: number) => void,
  onTotalPagesChange?: (total: number) => void
}) {
  const { name, description, prices, image } = data;
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableHeight, setAvailableHeight] = useState(500); // Default estimate

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Measure available height for items
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === containerRef.current) {
          // Subtract some padding/safety margin
          setAvailableHeight(entry.contentRect.height - 20);
        }
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, []);

  // Filter prices
  const allFilteredPrices = useMemo(() => {
    return (prices || []).filter(p => {
      if (p.product && typeof p.product === 'object') {
        return (p.product as { showInSlider?: boolean }).showInSlider !== false;
      }
      return true;
    });
  }, [prices]);

  // Dynamic Page Calculation
  const pages = useMemo(() => {
    // Estimating item heights
    // Mobile: single col, desktop: 2 cols
    // Header page (P0) is special
    const itemHeight = isMobile ? 60 : 85; 
    const columns = isMobile ? 1 : 2;
    
    // Rows available on P0 (Header is visible)
    // availableHeight is already "net" height (after header), so NO subtraction needed.
    const p0AvailableHeight = Math.max(120, availableHeight);
    const p0Rows = Math.max(1, Math.floor(p0AvailableHeight / itemHeight));
    const p0Count = p0Rows * columns;

    // Rows available on other pages
    const otherRows = Math.max(1, Math.floor(availableHeight / itemHeight));
    const restCount = otherRows * columns;

    const p0 = allFilteredPrices.slice(0, p0Count);
    const rest = allFilteredPrices.slice(p0Count);
    const chunks = [];
    for (let i = 0; i < rest.length; i += restCount) {
      chunks.push(rest.slice(i, i + restCount));
    }
    const result = [p0, ...chunks];
    if (result.length === 1 && result[0].length === 0) return []; // Empty case
    return result;
  }, [allFilteredPrices, isMobile, availableHeight]);

  const currentPageItems = pages[internalPage] || [];
  const totalInternalPages = pages.length;

  // Notify parent of total pages
  useEffect(() => {
    onTotalPagesChange?.(totalInternalPages);
  }, [totalInternalPages, onTotalPagesChange]);

  return (
    <div className="flex justify-center items-center w-full max-w-[1200px] mx-auto px-4 md:px-16 py-8 md:py-16 h-full box-border max-md:pt-24 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full bg-white/5 backdrop-blur-sm border border-brand-brown/20 rounded-[40px] p-8 md:p-12 pb-2 md:pb-0 relative flex flex-col h-full max-h-[65vh]"
      >
        <span className="absolute top-0 left-0 bg-brand-brown/40 text-white text-[10px] px-2 py-1 rounded-br-xl z-50">pub:PRICELIST_CONTAINER</span>

        <div className="absolute top-0 original-right-0 w-64 h-64 bg-brand-brown/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header - Only prominent on Page 0 */}
          <AnimatePresence mode="wait">
            {internalPage === 0 && (
              <motion.div 
                key="header"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 md:mb-10 text-center md:text-left relative border border-brand-brown/20 p-4 shrink-0"
              >
                {image && (
                  <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-[10%] bottom-[40%] md:bottom-[10%] w-[200px] h-[250px] md:w-[450px] md:h-[500px] opacity-20 md:opacity-30 pointer-events-none -z-10">
                    <Image 
                      src={image} 
                      alt="" 
                      fill 
                      className="object-contain object-center-bottom md:object-right-bottom" 
                      priority
                    />
                  </div>
                )}
                <span className="absolute top-0 right-0 bg-brand-brown text-white text-[8px] px-1">pub:7/8</span>
                <h2 className="text-[2.5rem] md:text-[4rem] font-extrabold leading-[1] text-brand-brown mb-2 md:mb-4">
                  {name}
                </h2>
                <p className="text-[1rem] md:text-[1.2rem] opacity-70 max-w-[600px] leading-tight mt-0.0 md:mt-1">
                  {description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Small Header for other pages */}
          {internalPage > 0 && (
            <div className="mb-4 md:mb-8 flex justify-between items-center border-b border-brand-brown/20 pb-2 md:pb-4 shrink-0">
               <h3 className="text-[1.2rem] md:text-[1.8rem] font-bold text-brand-brown opacity-80 uppercase tracking-widest">
                {name} <span className="opacity-40 ml-2">({internalPage + 1}/{totalInternalPages})</span>
              </h3>
            </div>
          )}

          {/* Items Container - This is what we measure */}
          <div ref={containerRef} className="flex-1 relative min-h-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={internalPage}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-3 md:gap-y-4"
              >
                {currentPageItems.map((item, index) => {
                  const product = typeof item.product === 'object' ? item.product : null;
                  
                  return (
                    <motion.div 
                      key={`${internalPage}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex flex-col border-b border-brand-brown/10 pb-2 group hover:border-brand-brown/30 transition-colors relative"
                    >
                      <span className="absolute -top-2 left-0 text-[6px] opacity-40">pub:9/10/11</span>
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="text-[1.1rem] md:text-[1.8rem] font-bold text-brand-brown/90 group-hover:text-brand-brown transition-colors truncate pr-2">
                          {item.name}
                        </span>
                        <span className="text-[1.1rem] md:text-[1.5rem] font-bold text-brand-brown font-mono shrink-0">
                          {item.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-end">
                        {item.description && (
                          <span className="text-[0.8rem] md:text-[1.0rem] opacity-60 italic line-clamp-2 leading-tight mt-0.0 md:mt-1">
                            {item.description}
                          </span>
                        )}
                        {product && product.slug && (
                          <Link 
                            href={`/termek/${product.slug}`}
                            className="text-[0.65rem] md:text-[0.7rem] font-bold text-brand-brown border border-brand-brown/30 px-2 py-0.5 rounded-full hover:bg-brand-brown hover:text-white transition-all ml-4 shrink-0"
                          >
                            Részletek
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Internal Pagination Dots/Tabs */}
          {totalInternalPages > 1 && (
            <div className="mt-6 md:mt-12 mb-2 flex justify-center gap-3 shrink-0">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => onInternalPageChange?.(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    internalPage === idx 
                      ? "bg-brand-brown w-6 md:w-8" 
                      : "bg-brand-brown/20 hover:bg-brand-brown/40"
                  }`}
                  aria-label={`Ugrás a(z) ${idx + 1}. belső oldalra`}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
