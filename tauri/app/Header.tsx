import Image from 'next/image';

export default function Header() {
  return (
    <div className="flex flex-row justify-center items-center px-10 py-3">
      <div className="">
        <h1 className="text-4xl tracking-tight sm:text-5xl md:text-6xl">
          <span className="text-blue font-extrabold"> Dabih </span>
          data upload
        </h1>
        <div className="flex flex-row items-center">
          <div className="relative w-10 h-10">
            <Image
              className="object-contain"
              src="/images/spang-lab-logo.png"
              alt="Spang Lab Logo"
              sizes="99vw"
              fill
            />
          </div>
          <div className="p-3 text-xl font-bold text-gray-200">Spang Lab</div>
        </div>
      </div>
      <div className="px-10">
        <div className="relative w-24 h-24 truncate  rounded-full shadow-xl">
          <Image
            alt="Spang Lab Dabih Logo"
            fill
            sizes="99vw"
            className="object-contain"
            src="/images/dabih-logo.png"
          />
        </div>
      </div>
    </div>
  );
}
