import React from 'react';

import Sidebar from './Sidebar';

function Container({ children }) {
  return (
    <div className="flex flex-row justify-between bg-gray-100">
      <div className="shrink-0">
        <Sidebar />
      </div>
      <div className="p-4 text-gray-800 grow shrink md:px-12">
        <div className="block px-4 py-10 bg-white rounded-lg shadow-lg md:py-12 md:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
export default Container;
