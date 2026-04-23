"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="fixed inset-0 bg-brand-bg flex flex-col items-center justify-center z-[100] p-6 md:p-12 text-center overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg my-auto flex flex-col items-center"
      >
        <div className="w-12 h-12 bg-brand-brown/10 rounded-full flex items-center justify-center mb-6">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-brown w-6 h-6">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-brown mb-4 uppercase tracking-wider leading-tight text-center">
          Valami hiba történt
        </h1>
        
        <p className="text-brand-brown/70 mb-10 leading-relaxed text-base md:text-lg px-4 max-w-md text-center">
          Váratlan hiba lépett fel az oldal betöltése közben. A fejlesztőink már tudnak róla!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto px-8 py-4 bg-brand-brown text-brand-bg rounded-full hover:bg-brand-brown/90 transition-all font-bold uppercase tracking-widest shadow-lg active:scale-95 text-xs sm:text-sm"
          >
            Próbálkozás újra
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-4 border-2 border-brand-brown text-brand-brown rounded-full hover:bg-brand-brown hover:text-brand-bg transition-all font-bold uppercase tracking-widest text-xs sm:text-sm"
          >
            Vissza a főoldalra
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
