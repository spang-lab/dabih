import React from 'react';

export function Pre({ children, className }) {
  return (
    <div className="mx-3 my-2 rounded-lg shadow-lg border border-gray-400">
      <pre className={className}>
        {children}
      </pre>
    </div>
  );
}

export function Code({ children, className }) {
  return (
    <code className={`rounded-xl ${className}`}>
      {children}
    </code>
  );
}

export default Code;
