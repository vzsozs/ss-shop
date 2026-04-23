"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-brand-bg flex flex-col items-center justify-center z-[100]">
      <div className="relative">
        {/* Animated Loading Circle */}
        <motion.div
          className="w-24 h-24 border-4 border-brand-brown/10 border-t-brand-brown rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Pulsing Logo Placement / Name */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-brand-brown font-bold tracking-widest text-sm"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          SAJT SONKA
        </motion.div>
      </div>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="mt-8 text-brand-brown font-medium tracking-widest uppercase text-xs"
      >
        Ízek betöltése...
      </motion.p>
    </div>
  );
}
