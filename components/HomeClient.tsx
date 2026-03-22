"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slide from "@/components/Slide";
import SwipeIndicator from "@/components/SwipeIndicator";
import { SlideData } from "@/types/types";

export default function HomeClient({ slides }: { slides: SlideData[] }) {
  const [[page, direction], setPage] = useState([0, 0]);
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const [totalInternalPages, setTotalInternalPages] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const activeIndex = page;
  const totalSlides = slides.length + 1;

  const triggerCooldown = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  }, []);

  const paginate = useCallback((newDirection: number, forceSlideChange: boolean = false) => {
    if (isAnimating) return;
    setHasInteracted(true);

    if (!forceSlideChange) {
      // Check for internal pagination
      if (newDirection === 1 && internalPageIndex < totalInternalPages - 1) {
        setInternalPageIndex(prev => prev + 1);
        triggerCooldown();
        return;
      }
      if (newDirection === -1 && internalPageIndex > 0) {
        setInternalPageIndex(prev => prev - 1);
        triggerCooldown();
        return;
      }
    }

    // Main slide change
    const nextIndex = activeIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < totalSlides) {
      setPage([nextIndex, newDirection]);
      
      // Determine new internal page index
      if (newDirection === 1) {
        setInternalPageIndex(0);
      } else {
        // When going back, we don't know the total pages of the previous slide yet
        // So we set it to a temporary high value, PriceList will correct it via callback
        setInternalPageIndex(99); 
      }
      
      triggerCooldown();
    }
  }, [activeIndex, isAnimating, totalSlides, triggerCooldown, internalPageIndex, totalInternalPages]);

  // Handle callback from PriceList when total pages are measured
  const handleTotalPagesChange = useCallback((total: number) => {
    setTotalInternalPages(total);
    // If we were at "99" (going back), snap to the last page
    if (internalPageIndex === 99) {
      setInternalPageIndex(Math.max(0, total - 1));
    }
  }, [internalPageIndex]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      setHasInteracted(true);
      if (Math.abs(e.deltaY) < 10) return;
      if (e.deltaY > 0) paginate(1);
      else paginate(-1);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [paginate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setHasInteracted(true);
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX.current - touchEndX;

    if (Math.abs(deltaX) > 50) {
      if (deltaX > 0) paginate(1);
      else paginate(-1);
    }
    touchStartX.current = null;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
    }),
    center: {
      x: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
    })
  };

  if (!slides || slides.length === 0) {
    return (
      <main className="relative w-full h-dvh flex flex-col items-center justify-center bg-brand-bg p-8 text-center">
        <div className="w-24 h-24 mb-8 opacity-20">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-brown">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-brand-brown mb-4 uppercase tracking-widest">Hoppá!</h2>
        <p className="text-brand-brown/60 max-w-md mx-auto leading-relaxed">
          Porszem került a gépezetbe... Jelenleg nem tudjuk betölteni az ízeket. 
          Kérünk, próbáld meg később!
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-8 py-3 bg-brand-brown text-white rounded-full hover:bg-brand-brown/90 transition-colors uppercase tracking-widest text-sm font-bold"
        >
          Frissítés
        </button>
      </main>
    );
  }

  return (
    <main 
      className="relative w-full h-dvh overflow-hidden bg-brand-bg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content Mask */}
      <div className="content-mask">
        <AnimatePresence initial={false} custom={direction}>
          {activeIndex < slides.length ? (
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 35 },
              }}
              className="absolute inset-0 w-full h-full"
            >
              <Slide 
                data={slides[activeIndex]} 
                internalPage={internalPageIndex}
                onInternalPageChange={setInternalPageIndex}
                onTotalPagesChange={handleTotalPagesChange}
              />
            </motion.div>
          ) : (
            <motion.div
              key="soon-section"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 35 },
              }}
              className="absolute inset-0 w-full h-full flex items-center justify-center bg-brand-bg"
            >
              <h1 className="text-[6vw] opacity-30 font-bold text-brand-brown">Hamarosan...</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Frame Container Visuals */}
      <div className="frame-container pointer-events-none z-50">
        <div className="corner-base top-0 left-0" />
        <div className="corner-base top-0 right-0 rotate-90" />
        <div className="corner-base bottom-0 left-0 -rotate-90" />
        <div className="corner-base bottom-0 right-0 rotate-180" />
        
        <div className="line-brown h-[2px] top-0 left-[25px] right-[25px]" />
        <div className="line-brown h-[2px] bottom-0 left-[25px] right-[25px]" />
        <div className="line-brown w-[2px] top-[25px] bottom-[25px] left-0" />
        <div className="line-brown w-[2px] top-[25px] bottom-[25px] right-0" />
      </div>

      {/* Quick Skip Button - Right Edge Center */}
      <AnimatePresence>
        {activeIndex < totalSlides - 1 && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 0.3, x: 0 }}
            whileHover={{ opacity: 1, scale: 1.05 }}
            onClick={() => paginate(1, true)}
            className="fixed right-2 md:right-4 top-1/2 -translate-y-1/2 z-[100] text-brand-brown p-2 transition-all group pointer-events-auto"
            title="Következő oldal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 md:w-8 md:h-8 rotate-[-90deg] group-hover:translate-y-1 transition-transform drop-shadow-sm">
              <path d="M19 6l-7 7-7-7" />
            </svg>
            <span className="sr-only">Következő</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <motion.div 
        initial={false}
        animate={{ opacity: isAnimating ? 0.8 : 0.2 }}
        className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-brand-brown/10 rounded-full z-[60] pointer-events-none"
      >
        <motion.div 
          className="h-full bg-brand-brown origin-left rounded-full"
          initial={false}
          animate={{ scaleX: (activeIndex + 1) / totalSlides }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>

      {/* Discrete Swipe Indicator on first slide */}
      <AnimatePresence>
        {activeIndex === 0 && !hasInteracted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-32 md:bottom-16 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
          >
            <SwipeIndicator mode="minimal" />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
