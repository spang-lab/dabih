import React from 'react';

export default function NavLine({ state }) {
  if (state === 'complete') {
    return (
      <div className="flex-auto mx-3 border-t-2 border-emerald-600" />
    );
  }
  if (state === 'active' || state === 'enabled') {
    return (
      <div className="flex-auto mx-3 border-t-2 border-sky-600" />
    );
  }
  return (
    <div className="flex-auto mx-3 border-t-2 border-gray-300" />
  );
}
