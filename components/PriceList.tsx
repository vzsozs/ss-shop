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
  const stableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [stableHeight, setStableHeight] = useState(() => 
    typeof window !== 'undefined' ? window.innerHeight * 0.6 : 500
  );
  const [measuredHeaderHeight, setMeasuredHeaderHeight] = useState(0);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);

  // Extract unique subcategories
  const subcategories = useMemo(() => {
    const subs = new Set<string>();
    (prices || []).forEach(p => {
      if (p.subcategory) {
        p.subcategory.split(',').forEach(s => {
          if (s) subs.add(s);
        });
      }
    });
    return Array.from(subs);
  }, [prices]);

  // Reset internal page when subcategory changes
  useEffect(() => {
    onInternalPageChange?.(0);
  }, [activeSubcategory, onInternalPageChange]);

  const isHeaderVisible = internalPage === 0;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === stableRef.current) {
          setStableHeight(entry.contentRect.height);
        }
        if (entry.target === headerRef.current) {
          setMeasuredHeaderHeight(entry.contentRect.height);
        }
      });
    });

    if (stableRef.current) observer.observe(stableRef.current);
    if (headerRef.current) observer.observe(headerRef.current);

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.disconnect();
    };
  }, [isHeaderVisible]); 

  // Filter prices
  const allFilteredPrices = useMemo(() => {
    return (prices || []).filter(p => {
      // First filter by showInSlider
      if (p.product && typeof p.product === 'object') {
        if ((p.product as { showInSlider?: boolean }).showInSlider === false) return false;
      }
      
      // Then filter by subcategory if active
      if (activeSubcategory) {
        return (p.subcategory || '').split(',').includes(activeSubcategory);
      }
      
      return true;
    });
  }, [prices, activeSubcategory]);

  // Dinamikus oldalszámítás (Pagination)
  const pages = useMemo(() => {
    // Becsült elem magasságok: mobilon 70px, asztali gépen 85px
    const itemHeight = isMobile ? 70 : 85; 
    const columns = isMobile ? 1 : 2;
    
    // stableHeight: a teljes kártya mérhető magassága ( ResizeObserver méri)
    // Levonjuk a pöttyök és a belső margók becsült magasságát az alján
    const dotsAndPaddingHeight = isMobile ? 40 : 60;
    const contentAreaHeight = Math.max(200, stableHeight - dotsAndPaddingHeight);
    
    // Oldalankénti számítás
    // A 0. oldal speciális, mert ott látható a nagy fejléc (Cím + Leírás)
    // Ha már lemértük a fejlécet (measuredHeaderHeight), azt használjuk, egyébként tippelünk egy alapértelmezettet
    const headerSpace = measuredHeaderHeight > 0 
      ? measuredHeaderHeight + (isMobile ? 32 : 40) 
      : (isMobile ? 220 : 300); // Fix fallback, hogy ne ugráljon az oldalszám az első mérésig

    // Kiszámoljuk mennyi hely marad a termékeknek a 0. oldalon
    const p0AvailableHeight = Math.max(120, contentAreaHeight - headerSpace);
    const p0Rows = Math.max(1, Math.floor(p0AvailableHeight / itemHeight));
    const p0Count = p0Rows * columns;

    // A többi oldalon (P1, P2...) nincs nagy fejléc, így több termék fér el
    const restHeaderEstimate = isMobile ? 40 : 60;
    // Levonunk extra biztonsági tartalékot desktopon (hogy ne legyen túl szoros az alja)
    const restAvailableHeight = Math.max(120, contentAreaHeight - restHeaderEstimate - (isMobile ? 0 : 50));
    const restRows = Math.max(1, Math.floor(restAvailableHeight / itemHeight));
    const restCount = restRows * columns;

    // Felosztjuk a terméklistát az oldalak (p0 és a maradék chunks) között
    const p0 = allFilteredPrices.slice(0, p0Count);
    const rest = allFilteredPrices.slice(p0Count);
    const chunks = [];
    for (let i = 0; i < rest.length; i += restCount) {
      chunks.push(rest.slice(i, i + restCount));
    }
    const result = [p0, ...chunks];
    if (result.length === 1 && result[0].length === 0) return []; // Üres lista kezelése
    return result;
  }, [allFilteredPrices, isMobile, stableHeight, measuredHeaderHeight]);

  // Aktuális belső oldalon megjelenítendő elemek
  const currentPageItems = pages[internalPage] || [];
  // Összesített oldalszám (ez határozza meg a pöttyök számát)
  const totalInternalPages = pages.length;

  // Értesítjük a szülő komponenst (HomeClient), ha megváltozott az oldalszám
  useEffect(() => {
    onTotalPagesChange?.(totalInternalPages);
  }, [totalInternalPages, onTotalPagesChange]);

  return (
    <div className="flex justify-center items-center w-full max-w-[1200px] mx-auto px-4 md:px-16 py-8 md:py-16 h-full box-border max-md:pt-24 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full p-8 md:p-12 pb-2 md:pb-0 relative flex flex-col h-full max-h-[65vh]"
      >

        <div className="absolute top-0 original-right-0 w-64 h-64 bg-brand-brown/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div ref={stableRef} className="relative z-10 flex flex-col h-full">
          {/* Header - Only prominent on Page 0 */}
          <AnimatePresence mode="wait">
            {internalPage === 0 && (
              <motion.div 
                ref={headerRef}
                key="header"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 md:mb-10 text-center md:text-left relative"
              >
                {image && (
                  <div className="absolute left-1/2 -translate-x-1/2 md:left-auto md:right-0 md:translate-x-[10%] bottom-[40%] md:bottom-[0%] w-[200px] h-[250px] md:w-[450px] md:h-[500px] opacity-20 md:opacity-30 pointer-events-none -z-10">
                    <Image 
                      src={image} 
                      alt="" 
                      fill 
                      className="object-contain object-center-bottom md:object-right-bottom" 
                      priority
                    />
                  </div>
                )}
                <h2 className="text-[2.5rem] md:text-[4rem] font-extrabold leading-[1] text-black mb-2 md:mb-4">
                  {name}
                </h2>
                <p className="text-[1rem] md:text-[1.2rem] opacity-70 max-w-[600px] leading-tight mt-0.0 md:mt-1">
                  {description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Subcategory Tabs */}
          {subcategories.length > 0 && (
            <div className="mb-6 md:mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
              <button
                onClick={() => setActiveSubcategory(null)}
                className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[0.85rem] md:text-[1rem] font-bold transition-all whitespace-nowrap ${
                  activeSubcategory === null 
                    ? "bg-brand-brown text-white shadow-lg" 
                    : "bg-brand-brown/10 text-brand-brown hover:bg-brand-brown/20"
                }`}
              >
                Összes
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubcategory(sub)}
                  className={`px-4 py-1.5 md:px-6 md:py-2 rounded-full text-[0.85rem] md:text-[1rem] font-bold transition-all whitespace-nowrap ${
                    activeSubcategory === sub 
                      ? "bg-brand-brown text-white shadow-lg" 
                      : "bg-brand-brown/10 text-brand-brown hover:bg-brand-brown/20"
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Small Header for other pages */}
          {internalPage > 0 && (
            <div className="mb-4 md:mb-8 flex justify-between items-center border-b border-brand-brown/20 pb-2 md:pb-4 shrink-0">
               <h3 className="text-[1.2rem] md:text-[1.8rem] font-bold text-black opacity-80 uppercase tracking-sm">
                {name} <span className="opacity-40 ml-2">({internalPage + 1}/{totalInternalPages})</span>
              </h3>
            </div>
          )}

          {/* Items Container - This is what we measure */}
          <div className="flex-1 relative min-h-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`${activeSubcategory}-${internalPage}`}
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

        </div>

        {/* Internal Pagination Dots/Tabs */}
        {totalInternalPages > 1 && (
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 md:-bottom-10 flex justify-center gap-3 z-20">
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
      </motion.div>
    </div>
  );
}
