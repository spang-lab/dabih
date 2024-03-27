import React from 'react';

export function H1(props) {
  const { children } = props;
  return (
    <h1 className="py-3 text-3xl font-extrabold">
      {children}
    </h1>
  );
}
export function H2(props) {
  const { children } = props;
  return (
    <h2 className="py-3 text-2xl font-bold">
      {children}
    </h2>
  );
}

export function H3(props) {
  const { children } = props;
  return (
    <h3 className="py-1 text-xl">
      {children}
    </h3>
  );
}
