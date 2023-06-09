import React from 'react';

export default function NavLine({ state }) {
  if (state === 'complete') {
    return <div className="flex-auto mx-3 border-t-2 border-main-mid" />;
  }
  if (state === 'active' || state === 'enabled') {
    return <div className="flex-auto mx-3 border-t-2 border-main-mid" />;
  }
  return <div className="flex-auto mx-3 border-t-2 border-gray-mid" />;
}
