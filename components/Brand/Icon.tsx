import React from 'react';
import Image from 'next/image';

export const Icon: React.FC = () => {
  return (
    <Image
      src="/images/SzivunkLelkunk-logo.svg"
      alt="SzivünkLelkünk Icon"
      width={24}
      height={24}
      className="w-6 h-auto"
    />
  );
};

export default Icon;
