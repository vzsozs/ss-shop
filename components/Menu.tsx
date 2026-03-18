"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuLinks = [
  { name: "Birodalom", href: "#" },
  { name: "Szendvicsek", href: "#" },
  { name: "Tálak", href: "#" },
  { name: "Múú és Röff", href: "#" },
];

export default function FullscreenMenu({ isOpen, onClose }: MenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex flex-col justify-center items-center bg-brand-brown overflow-hidden"
        >
          {/* Background overlay animation */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="absolute inset-0 bg-brand-brown z-0"
          />

          <div className="relative z-10 w-full h-full flex flex-col justify-between items-end p-12 md:p-24 md:pr-32">
            {/* Top Section: Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={onClose}
              className="text-white text-xl md:text-2xl uppercase tracking-[0.2em] font-light hover:opacity-70 transition-opacity cursor-pointer text-right"
            >
              [×] Bezár
            </motion.button>

            {/* Bottom Section: Socials and Menu */}
            <div className="flex flex-col gap-12 w-full items-end">
              {/* Social Links (Above Menu) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-end gap-3 text-white/50 uppercase tracking-widest text-xs md:text-sm"
              >
                <div className="w-8 h-0.5 bg-brand-bg/30 mb-2" />
                <div className="flex flex-col gap-2 items-end">
                  <Link href="mailto:info" className="hover:text-white transition-opacity">email</Link>
                  <Link href="#" className="hover:text-white transition-opacity">Facebook</Link>
                  <Link href="#" className="hover:text-white transition-opacity">Youtube</Link>
                  <Link href="#" className="hover:text-white transition-opacity">Térkép</Link>
                </div>
              </motion.div>

              {/* Primary Menu Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-end gap-4 text-white"
              >
                {menuLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={onClose}
                    className="text-4xl md:text-8xl font-bold opacity-30 hover:opacity-100 transition-opacity leading-none uppercase tracking-tighter text-right"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <Link
                  href="#"
                  onClick={onClose}
                  className="mt-4 flex items-center gap-4 text-white hover:text-white/80 transition-colors opacity-60"
                >
                  <Image src="/images/nyil.svg" alt="Arrow" width={30} height={30} className="invert w-6 md:w-8 h-auto rotate-180" />
                  <span className="text-xl md:text-2xl uppercase tracking-widest font-light">Kapcsolat</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
