import BrowserSupport from "@/util/BrowserSupport";
import { Link } from "react-router";

import { DabihInfo } from "@/lib/api/types";
import { useEffect, useState } from "react";
import api from "@/lib/api";



export default function Home() {
  const [info, setInfo] = useState<DabihInfo | null>(null);
  const d = info?.branding?.department || {
    name: "",
    logo: undefined,
    url: ""
  }
  const o = info?.branding?.organization || {
    name: "",
    logo: undefined,
    url: ""
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const { data } = await api.util.info();
      if (!data) {
        console.error('Failed to fetch info');
        return;
      }
      setInfo(data);
    };
    void fetchInfo();
  }, []);
  return (
    <div className="px-4 flex justify-center">
      <BrowserSupport />
      <div className="flex flex-row items-center pt-10">
        <div className="p-3 basis-3/4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to the
            <br />
            <span className="text-blue"> Dabih data storage platform </span>
          </h1>
          <div className="flex items-center pt-2">
            <div className="flex flex-row px-4">
              <div className="relative w-16 h-16">
                <img
                  className="object-contain"
                  src={d.logo}
                  alt={`${d.name} logo`}
                  sizes="99vw"
                />
              </div>
              <div className="p-3 text-3xl font-bold text-gray-400">
                <a href={d.url} target="_blank" rel="noopener noreferrer">
                  {d.name}
                </a>
              </div>
            </div>
            <div className="flex flex-row items-center">
              <div className="relative w-12 h-12">
                <img
                  className="object-contain"
                  src={o.logo}
                  alt={`${o.name} logo`}
                  sizes="99vw"
                />
              </div>
              <div className="p-3 text-xl font-bold text-gray-400">
                <a href={o.url} target="_blank" rel="noopener noreferrer">
                  {o.name}
                </a>
              </div>
            </div>
          </div>
          <div className="text-base text-gray-400 sm:text-lg md:text-xl">
            <ul className="px-4 list-disc">
              <li> A secure way to upload and share data</li>
              <li> End to end encrypted virtual filesystem </li>
              <li> You decide who gets access to your data</li>
              <li> Simple to use </li>
            </ul>
          </div>
          <div className="py-5 flex flex-row items-center">
            <Link
              className="text-2xl text-white bg-blue rounded-md px-4 py-3"
              to="/signin"
            >
              Get Started
            </Link>
            <Link
              className="text-xl text-blue hover:underline mx-5 px-4 py-3"
              to="/docs"
            >
              Documentation
            </Link>
          </div>
        </div>
        <div className="basis-1/4">
          <div className="relative w-32 h-32 truncate rounded-full shadow-xl lg:w-72 lg:h-72">
            <img
              alt="Spang Lab Dabih Logo"
              sizes="99vw"
              width={288}
              height={288}
              className="object-contain"
              src="/images/dabih-logo.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
