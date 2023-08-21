import React from 'react';

import Sidebar from './Sidebar';

function Container({ children }) {
  return (
    <div className="flex flex-row justify-between">
      <div className="shrink-0">
        <Sidebar />
      </div>
      <div className="text-gray-800 flex-1 pl-3">
        {children}
      </div>
    </div>
  );
}
export default Container;
