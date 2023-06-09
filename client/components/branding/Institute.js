import React from 'react';
import Image from 'next/image';

function SpangLabBrand() {
  return (
    <div className="flex flex-row">
      <div className="relative w-16 h-16">
        <Image
          className="object-contain"
          src="/images/spang-lab-logo.png"
          alt="Spang Lab Logo"
          sizes="99vw"
          fill
        />
      </div>
      <div className="p-3 text-3xl font-bold text-gray-mid">Spang Lab</div>
    </div>
  );
}

export default SpangLabBrand;
