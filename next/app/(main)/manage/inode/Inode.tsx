
import { InodeMembers, InodeType } from "@/lib/api/types";

import Draggable from "./Draggable";
import Droppable from "./Droppable";
import { Folder, Trash2 } from "react-feather";

import Icon from "./Icon";
import FileName from "./Filename";
import { useState } from "react";


export default function Inode({
  data: node,
  selected,
  draggable,
  onRename,
}: {
  data: InodeMembers,
  selected: boolean
  draggable?: boolean,
  onRename: (mnemonic: string, name: string) => void
}) {
  const [name, setName] = useState<string | null>(null);
  const { type } = node;



  const getName = () => {
    if (!name) {
      return (
        <FileName fileName={node.name} />
      );
    }
    return (
      <input
        autoFocus
        className="w-full h-full border text-blue"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onFocus={(e) => {
          const idx = name.lastIndexOf(".") || name.length;
          e.target.setSelectionRange(0, idx);
        }}
        onKeyUp={(e) => {
          e.stopPropagation()
          if (e.key === "Enter") {
            if (name === node.name) {
              setName(null);
              return;
            }
            onRename(node.mnemonic, name);
            setName(null);
          }
        }}
        onKeyDown={(e) => { e.stopPropagation() }}
        onBlur={(e) => {
          e.stopPropagation();
          if (name === node.name) {
            setName(null);
            return;
          }
          onRename(node.mnemonic, name);
          setName(null);
        }}
      />
    );
  }


  if (type === InodeType.FILE) {
    if (draggable) {
      return (
        <Draggable id={node.mnemonic}>
          <div
            className="flex h-fit flex-col rounded-xl text-blue items-center">
            <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
              <Icon fileName={node.name} />
            </div>
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                setName(node.name);
              }}
              className={`max-w-full mx-1 rounded ${(selected && !name) ? "text-white bg-blue/90" : ""}`}>
              {getName()}
            </div>
          </div>
        </Draggable>
      );
    }
    return (
      <div
        className="flex h-fit flex-col rounded-xl text-blue items-center">
        <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
          <Icon fileName={node.name} />
        </div>
        <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
          <FileName fileName={node.name} />
        </div>
      </div>
    );
  }

  if (type === InodeType.DIRECTORY) {
    if (draggable) {
      return (
        <Draggable id={node.mnemonic}>
          <Droppable id={node.mnemonic}>
            <div
              className="flex h-fit flex-col rounded-xl text-blue items-center">
              <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
                <Folder size={85} strokeWidth={0.5} className="fill-blue/60 " />
              </div>
              <div
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setName(node.name);
                }}
                className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
                {getName()}
              </div>
            </div>
          </Droppable>
        </Draggable>
      );
    }
    return (
      <div
        className="flex h-fit flex-col rounded-xl text-blue items-center">
        <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
          <Folder size={85} strokeWidth={0.5} className="fill-blue/60 " />
        </div>
        <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
          <FileName fileName={node.name} />
        </div>
      </div>
    );
  }
  if (type === InodeType.TRASH) {
    return (
      <Droppable id={node.mnemonic}>
        <div
          className="flex h-fit flex-col rounded-xl text-blue items-center">
          <div className={`m-1 relative rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
            <Folder size={80} strokeWidth={0.5} className="text-blue fill-blue/40" />
            <Trash2 size={40} strokeWidth={1} className="absolute bottom-4 left-5 text-gray-700 fill-gray-400/50" />
          </div>
          <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
            Trash
          </div>
        </div>
      </Droppable >
    );
  }

  return (
    <div className="border text-xs">
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
}
