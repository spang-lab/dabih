'use client';

import React from 'react';

export function BigButton(props) {
  const {
    onClick, children, className, disabled,
  } = props;
  const classes = `
    px-8 py-4 text-2xl rounded-xl
    text-gray-100 bg-blue enabled:hover:bg-blue
    enabled:hover:text-white focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white
    disabled:opacity-50 
    ${className}`;

  return (
    <button
      disabled={disabled}
      type="button"
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function MutedButton({ onClick, children, className }) {
  const classes = `
    px-3 py-2 rounded
    border border-gray-400
    text-gray-800 bg-gray-100 hover:bg-gray-400
    hover:text-white focus:outline-none 
    ${className}`;
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
export function ColoredButton({ onClick, children, className }) {
  const classes = `
    px-3 py-2 text-lg rounded
    text-gray-100 bg-blue hover:bg-blue
    hover:text-white focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white
    ${className}`;
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export function SmallButton({ onClick, children, className }) {
  const classes = `
    px-2 py-1 text-sm rounded
    text-gray-100 bg-blue hover:bg-blue
    focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white
    ${className}`;
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
