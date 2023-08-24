'use client';
import React from 'react';

export default function ApiRoute({
  children, method, path, action,
}) {
  const id = path.slice(1).replace(/\//g, '-').replace(/:/g, '');
  const getAction = () => {
    if (!action) {
      return null;
    }
    return (
      <span className="my-2 text-base font-semibold text-gray-400 w-42">
        Event:
        <span className="px-1 py-1 mx-1 border-2 border-gray-400 rounded">
          {action}
        </span>
      </span>
    );
  };

  return (
    <div id={id} className="mt-20">
      <div className="flex flex-wrap items-center my-3 text-2xl">
        <div>
          <span className="w-20 font-extrabold text-blue">{method}</span>
        </div>
        <div className="grow">
          <span className="px-2 py-1 mx-5 text-blue border border-blue rounded-lg">
            /api/v1
            {path}
          </span>
        </div>
        {getAction()}
      </div>
      <div className="pl-10 text-lg text-gray-400">{children}</div>
    </div>
  );
}
