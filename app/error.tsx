"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

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
    <div className="fixed inset-0 bg-brand-bg flex flex-col items-center justify-center z-[100] p-8 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="w-20 h-20 bg-brand-brown/10 rounded-full flex items-center justify-center mx-auto mb-8">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand-brown w-10 h-10">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-extrabold text-brand-brown mb-6 uppercase tracking-wider">
          Valami hiba történt
        </h1>
        
        <p className="text-brand-brown/70 mb-10 leading-relaxed text-lg">
          Váratlan hiba lépett fel az oldal betöltése közben. A fejlesztőink már tudnak róla!
        </p>
        
        <button
          onClick={() => reset()}
          className="px-12 py-4 bg-brand-brown text-brand-bg rounded-full hover:bg-brand-brown/90 transition-all font-bold uppercase tracking-widest shadow-lg active:scale-95"
        >
          Próbálkozás újra
        </button>
      </motion.div>
    </div>
  );
}
