import React from 'react';

function TextHighlight({ children }) {
  return (
    <span className="font-semibold text-sky-700">
      {children}
    </span>
  );
}

export default TextHighlight;
