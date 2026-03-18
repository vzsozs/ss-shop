"use client";

import Image from "next/image";

interface SidebarProps {
  onMenuClick: () => void;
}

export default function Sidebar({ onMenuClick }: SidebarProps) {
  return (
    <div className="z-[1000] flex-none w-[3rem] h-full relative md:w-[3rem] max-md:order-last max-md:w-full max-md:h-16">
      <div className="md:border-r max-md:border-t border-brand-brown/17 bg-brand-brown/10 flex flex-col justify-between items-center w-full h-full py-8 max-md:flex-row max-md:px-8 max-md:py-0">
        
        {/* Hamburger - Mobile: Right, Desktop: Top */}
        <button 
          onClick={onMenuClick}
          className="group flex flex-col gap-0.5 justify-center items-center w-[40px] h-[40px] md:rotate-90 transition-all hover:blur-[1px] max-md:rotate-0 max-md:order-last cursor-pointer"
          aria-label="Menu"
        >
          <div className="w-6 h-[2px] bg-brand-brown group-hover:bg-brand-brown/80" />
          <div className="w-6 h-[2px] bg-brand-brown group-hover:bg-brand-brown/80" />
          <div className="w-6 h-[2px] bg-brand-brown group-hover:bg-brand-brown/80" />
        </button>

        {/* Logo and EST section - Mobile: Left, Desktop: Bottom */}
        <div className="flex flex-col items-center gap-8 max-md:flex-row max-md:gap-4 max-md:order-first">
          <div className="text-brand-brown/60 whitespace-nowrap text-[0.8rem] font-black leading-none -rotate-90 max-md:rotate-0 max-md:order-last">
            EST. 2023
          </div>
          <Image
            src="/images/SzivunkLelkunk-logo.svg"
            alt="SzivünkLelkünk"
            width={32}
            height={32}
            className="w-8 h-auto max-md:order-first"
          />
        </div>
      </div>
    </div>
  );
}
