import React from "react";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <nav className="bg-gray-800">
      <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center justify-start flex-1 pl-12 sm:items-stretch sm:pl-0">
            <div className="w-full sm:ml-6">
              <Navigation />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
