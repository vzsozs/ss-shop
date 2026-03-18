"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-60 w-[13rem] md:w-[16rem] flex items-center justify-center pt-4 md:pt-0">
      <Link href="/" className="transition-transform hover:scale-105 active:scale-95">
        <Image
          src="/images/SajtSonka-birodalom-logo-01.svg"
          alt="SajtSonka Logo"
          width={250}
          height={100}
          className="w-full h-auto"
          priority
        />
      </Link>
    </div>
  );
}
