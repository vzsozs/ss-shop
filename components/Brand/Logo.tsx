import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ className, width = 32, height = 32 }) => {
  return (
    <Image
      src="/images/SzivunkLelkunk-logo.svg"
      alt="SzivünkLelkünk"
      width={width}
      height={height}
      className={className || 'w-8 h-auto'}
    />
  );
};

export default Logo;
