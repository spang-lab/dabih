
import { InodeMembers, InodeType } from "@/lib/api/types";

import Draggable from "./Draggable";
import Droppable from "./Droppable";

import Icon from "./Icon";
import FileName from "./Filename";
import { useState } from "react";
import useFinder from "../Context";


export default function Inode({
  inode,
  selected,
}: {
  inode: InodeMembers,
  selected: boolean,
}) {
  const { rename } = useFinder();
  const [name, setName] = useState<string | null>(null);
  const { type, mnemonic } = inode;

  const getName = () => {
    if (!name) {
      return (
        <FileName fileName={inode.name} />
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
            if (name === inode.name) {
              setName(null);
              return;
            }
            rename(mnemonic, name);
            setName(null);
          }
        }}
        onKeyDown={(e) => { e.stopPropagation() }}
        onBlur={(e) => {
          e.stopPropagation();
          if (name === inode.name) {
            setName(null);
            return;
          }
          rename(mnemonic, name);
          setName(null);
        }}
      />
    );
  }


  if (type === InodeType.FILE) {
    return (
      <Draggable id={mnemonic}>
        <div
          className="flex h-fit flex-col rounded-xl text-blue items-center">
          <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
            <Icon inode={inode} />
          </div>
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              setName(inode.name);
            }}
            className={`max-w-full px-1 rounded ${(selected && !name) ? "text-white bg-blue/90" : ""}`}>
            {getName()}
          </div>
        </div>
      </Draggable>
    );
  }

  if (type === InodeType.DIRECTORY) {
    return (
      <Draggable id={mnemonic}>
        <Droppable id={mnemonic}>
          <div
            className="flex h-fit flex-col rounded-xl text-blue items-center">
            <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
              <Icon inode={inode} />
            </div>
            <div
              onDoubleClick={(e) => {
                e.stopPropagation();
                setName(inode.name);
              }}
              className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
              {getName()}
            </div>
          </div>
        </Droppable>
      </Draggable>
    );
  }
  if (type === InodeType.TRASH) {
    return (
      <Droppable id={mnemonic}>
        <div
          className="flex h-fit flex-col rounded-xl text-blue items-center">
          <div className={`m-1 relative rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
            <Icon inode={inode} />
          </div>
          <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
            Bin
          </div>
        </div>
      </Droppable >
    );
  }

  return (
    <div
      className="flex h-fit flex-col rounded-xl text-blue/70 items-center">
      <div className={`m-1 relative rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
        <Icon inode={inode} />
      </div>
      <div className={`max-w-full px-1 text-[10px] rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
        <FileName fileName={inode.name} />
      </div>
    </div>
  );
}
