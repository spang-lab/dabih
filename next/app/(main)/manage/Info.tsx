"use client";

import useFinder from "./Context";

export default function Info() {
  const { nodes, selected } = useFinder();
  const set = new Set(selected);
  const selectedNodes = nodes.filter((node) => set.has(node.mnemonic));


  return (
    <div>
      <pre>
        {JSON.stringify(selectedNodes, null, 2)}
      </pre>
    </div>
  );
}
