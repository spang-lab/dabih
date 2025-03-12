"use client";

import useFiles from "@/lib/hooks/files";
import useFinder from "./Context";
import InodeInfo from "./info/Inode";
import Members from "./info/Members";


export default function Info() {
  const { selected } = useFinder();
  const nodes = useFiles((state) => state.nodes);
  const set = new Set(selected);
  const selectedNodes = nodes.filter((node) => set.has(node.mnemonic));

  if (selectedNodes.length === 0) {
    return null;
  }

  if (selectedNodes.length === 1) {
    const node = selectedNodes[0];
    return (
      <div>
        <InodeInfo inode={node} />
        <Members inode={node} />
      </div>
    );
  }


  return (
    <div>
      <pre>
        {JSON.stringify(selectedNodes, null, 2)}
      </pre>
    </div>
  );
}
