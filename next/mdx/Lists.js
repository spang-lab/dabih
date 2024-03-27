import React from 'react';

export function UnorderedList(props) {
  const { children } = props;
  return (
    <ul className="list-disc p-3 list-inside">
      <div className="border-t" />
      {children}
    </ul>
  );
}

export function OrderedList(props) {
  const { children } = props;
  return (
    <ul className="list-decimal p-3 list-inside">
      <div className="border-t" />
      {children}
    </ul>
  );
}

export function ListItem(props) {
  const { children } = props;
  return (
    <li className="p-1 border-b">
      {children}
    </li>
  );
}
