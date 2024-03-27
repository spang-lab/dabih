import React from 'react';

export function Table(props) {
  const { children } = props;
  return (
    <div className="px-10 py-5">
      <table className="w-full text-sm border border-collapse border-slate-400">
        {children}
      </table>
    </div>
  );
}
export function Tr(props) {
  const { children } = props;
  return (
    <tr className="">
      {children}
    </tr>
  );
}

export function Thead(props) {
  const { children } = props;
  return (
    <thead className="bg-slate-100">
      {children}
    </thead>
  );
}

export function Th(props) {
  const { children } = props;
  return (
    <th className="p-3 border border-slate-300">
      {children}
    </th>
  );
}

export function Td(props) {
  const { children } = props;
  return (
    <td className="p-3 border border-slate-300">
      {children}
    </td>
  );
}
