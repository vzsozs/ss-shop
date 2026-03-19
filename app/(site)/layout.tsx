"use client";

import { Rokkitt } from "next/font/google";
import "../globals.css"; /* Path adjusted */
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Preloader from "@/components/Preloader";
import FullscreenMenu from "@/components/Menu";
import { useState } from "react";

const rokkitt = Rokkitt({
  subsets: ["latin"],
  variable: "--font-rokkitt",
});

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <html lang="hu">
      <body className={`${rokkitt.variable} font-rokkitt antialiased`}>
        <Preloader />
        <FullscreenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className="flex flex-col md:flex-row h-dvh overflow-hidden select-none">
          <Sidebar onMenuClick={() => setIsMenuOpen(!isMenuOpen)} />
          <div className="flex-1 relative h-full overflow-hidden">
            <Navbar />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
