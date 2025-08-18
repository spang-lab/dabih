"use client";

import useFiles from "@/lib/hooks/files";
import useFinder from "./Context";
import InodeInfo from "./info/Inode";
import Members from "./info/Members";
import Buttons from "./info/Buttons";


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
        <Buttons />
      </div>
    );
  }

  const n = selectedNodes.length;
  return (
    <div>
      <div className="flex justify-center">
        <h3 className="text-lg font-semibold">
          <span className="text-white bg-blue px-2 py-1 rounded">
            {n}
          </span>
          {" "}
          Items Selected
        </h3>
      </div>
      <Buttons />
    </div>
  );
}
