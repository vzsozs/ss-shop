"use client";

import { motion } from "framer-motion";

interface SwipeIndicatorProps {
  mode?: "full" | "minimal";
  className?: string;
}

export default function SwipeIndicator({ mode = "full", className = "" }: SwipeIndicatorProps) {
  const isFull = mode === "full";

  return (
    <div className={`flex flex-col items-center justify-center md:hidden ${className}`}>
      <motion.div 
        className="relative bg-white/30 p-6 rounded-3xl backdrop-blur-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0 }}
      >
        {/* Arrows */}
        <div className={`flex items-center justify-between pointer-events-none ${isFull ? 'w-40' : 'w-24'}`}>
          <motion.svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#4a2c2a" 
            strokeWidth="2.5" 
            className={`${isFull ? 'w-8 h-8' : 'w-5 h-5'} opacity-80`}
            animate={{ x: [-5, 0, -5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>

          <motion.svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#4a2c2a" 
            strokeWidth="2.5" 
            className={`${isFull ? 'w-8 h-8' : 'w-5 h-5'} opacity-80`}
            animate={{ x: [5, 0, 5] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </div>

        {/* Hand Icon */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%]"
          animate={{ x: [-30, 30, -30] }}
          transition={{ 
            repeat: Infinity, 
            duration: 3, 
            ease: "easeInOut" 
          }}
        >
          <svg 
            viewBox="0 0 64 64" 
            fill="none"
            stroke="#4a2c2a"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`${isFull ? 'w-12 h-12' : 'w-8 h-8'} drop-shadow-xl`}
          >
            <path d="M40.1,56.3H25.5c-1.9,0-3.4-1.5-3.4-3.4v-4.6c0,0-6.3-4-6.3-9.2c0-11.7-0.2-15.4,5.9-15.4c0-4.8,0-7.8,0-13.1
              s6.8-5.3,6.8,0.1c0,6.8,0,11.4,0,11.4s3.4-2.7,6.6,1c3.6-1.7,6.4,0.6,6.7,2c2.6-0.9,5.3,0.4,6.2,2.1c0.9,1.7,0,7.7,0,10.5
              c0,2.9-2.2,9.5-4.4,10.4c0,0.5,0,4.2,0,4.7C43.5,54.8,42,56.3,40.1,56.3z"/>
          </svg>
        </motion.div>
      </motion.div>

      {isFull && (
        <motion.span 
          className="text-white/60 text-xs font-bold uppercase tracking-[0.2em] mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          LAPOZÁS
        </motion.span>
      )}
    </div>
  );
}
