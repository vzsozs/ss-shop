"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import SwipeIndicator from "./SwipeIndicator";

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            localStorage.setItem('ss-visited', 'true');
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/50 overflow-hidden"
        >
          {/* Background layers animation from bottom to top */}
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            className="absolute inset-0 bg-brand-brown/20 z-0"
          />
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
            className="absolute inset-0 bg-brand-brown/50 z-1"
          />
          <motion.div
            initial={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-brand-brown z-2"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative z-10 flex flex-col items-center"
          >
            <Image
              src="/images/SajtSonka-birodalom-logo-white.svg"
              alt="Logo"
              width={250}
              height={100}
              priority
              className="w-[150px] md:w-[250px]"
            />
            
            {/* Swipe Indicator shown only on first visit within the preloader */}
            {typeof window !== 'undefined' && !localStorage.getItem('ss-visited') && (
              <SwipeIndicator mode="full" className="mt-12" />
            )}

            <div className="w-[200px] h-[2px] bg-white/20 mt-8 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-brand-bg"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
