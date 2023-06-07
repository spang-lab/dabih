import React from 'react';

export default function CodeBlock({ children }) {
  return (
    <div className="w-3/4 overflow-scroll border border-gray-300 rounded">
      <pre className="p-1 text-xs font-semibold text-gray-400 xl:text-base">
        {children}
      </pre>
    </div>
  );
}
