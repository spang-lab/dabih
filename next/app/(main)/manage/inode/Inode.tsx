
import { InodeMembers, InodeType } from "@/lib/api/types";
import File from "./File";
import Directory from "./Directory";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { Trash } from "react-feather";



export default function Inode({
  data: node,
  selected,
  draggable,
}: {
  data: InodeMembers,
  selected: boolean
  draggable?: boolean,
}) {
  const { type } = node;
  if (type === InodeType.FILE) {
    if (draggable) {
      return (
        <Draggable id={node.mnemonic}>
          <File id={node.mnemonic} data={node} selected={selected} />
        </Draggable>
      );
    }
    return (
      <File id={node.mnemonic} data={node} selected={selected} />
    );
  }

  if (type === InodeType.DIRECTORY) {
    if (draggable) {
      return (
        <Draggable id={node.mnemonic}>
          <Droppable id={node.mnemonic}>
            <Directory data={node} selected={selected} />
          </Droppable>
        </Draggable>
      );
    }
    return (
      <Directory data={node} selected={selected} />
    );
  }
  if (type === InodeType.TRASH) {
    if (draggable) {
      return (
        <Droppable id={node.mnemonic}>
          <div
            className="flex h-fit flex-col rounded-xl text-blue items-center">
            <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
              <Trash size={80} strokeWidth={1} className="text-gray-800 fill-gray-800/40" />
            </div>
            <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
              Trash
            </div>
          </div>
        </Droppable >
      );
    }
    return (
      <Directory data={node} selected={selected} />
    );
  }

  return (
    <div className="border text-xs">
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
}
