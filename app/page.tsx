"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slide from "@/components/Slide";
import content from "@/data/content.json";

export default function Home() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const touchStartY = useRef<number | null>(null);

  const activeIndex = page;
  const totalSlides = content.length + 1;

  const triggerCooldown = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  }, []);

  const paginate = useCallback((newDirection: number) => {
    if (isAnimating) return;
    const nextIndex = activeIndex + newDirection;
    if (nextIndex >= 0 && nextIndex < totalSlides) {
      setPage([nextIndex, newDirection]);
      triggerCooldown();
    }
  }, [activeIndex, isAnimating, totalSlides, triggerCooldown]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 10) return;
      if (e.deltaY > 0) paginate(1);
      else paginate(-1);
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [paginate]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY;

    if (Math.abs(deltaY) > 50) {
      if (deltaY > 0) paginate(1);
      else paginate(-1);
    }
    touchStartY.current = null;
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

  return (
    <main 
      className="relative w-full h-dvh overflow-hidden bg-brand-bg"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Content Mask */}
      <div className="content-mask">
        <AnimatePresence initial={false} custom={direction}>
          {activeIndex < content.length ? (
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
                id={content[activeIndex].id}
                name={content[activeIndex].name}
                description={content[activeIndex].description}
                image={content[activeIndex].image}
                category={content[activeIndex].category}
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
              <h1 className="text-[6vw] opacity-30">Hamarosan...</h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Frame Container Visuals - Fixed via CSS */}
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

      {/* Progress Indicator */}
      <motion.div 
        initial={false}
        animate={{ opacity: isAnimating ? 0.8 : 0.2 }}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-64 h-1 bg-brand-brown/10 rounded-full z-[60] pointer-events-none"
      >
        <motion.div 
          className="h-full bg-brand-brown origin-left rounded-full"
          initial={false}
          animate={{ scaleX: (activeIndex + 1) / totalSlides }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </main>
  );
}
