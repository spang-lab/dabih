
import { InodeMembers, InodeType } from "@/lib/api/types";

import Draggable from "./Draggable";
import Droppable from "./Droppable";

import Icon from "./Icon";
import FileName from "./Filename";
import { useState } from "react";
import useFinder from "../Context";


export default function Inode({ inode }: { inode: InodeMembers }) {
  const {
    openMenu,
    selected,
    parents,
    setSelected,
    list,
    user,
    search,
  } = useFinder();

  const isMember = [inode, ...parents].some((node) => {
    return node.members.some((member) => member.sub === user?.sub);
  });
  const isSearch = ["complete", "loading"].includes(search.status);

  return (
    <div
      className="h-fit w-32 select-none"
      key={inode.mnemonic}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.shiftKey || e.metaKey) {
          const newSelected = [...selected].filter((mnemonic) => mnemonic !== inode.mnemonic);
          if (selected.length === newSelected.length) {
            newSelected.push(inode.mnemonic);
          }
          setSelected(newSelected);
          return;
        }
        setSelected([inode.mnemonic]);
      }}
      onDoubleClick={() => {
        if (!isMember && !user?.isAdmin && !isSearch) {
          return;
        }
        list(inode.mnemonic);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selected.includes(inode.mnemonic)) {
          setSelected([inode.mnemonic]);
        }
        openMenu({ left: e.clientX, top: e.clientY });
      }}
    >
      <InodeInner
        inode={inode}
        selected={selected.includes(inode.mnemonic)}
        disabled={!isMember && !isSearch}
      />
    </div>
  );


}


function InodeInner({
  inode,
  selected,
  disabled,
}: {
  inode: InodeMembers,
  selected: boolean,
  disabled: boolean,
}) {
  const { rename } = useFinder();
  const [name, setName] = useState<string | null>(null);
  const { type, mnemonic } = inode;

  const dragId = `drag-${mnemonic}`;
  const dropId = `drop-${mnemonic}`;

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
      <Draggable id={dragId}>
        <div
          className={`flex h-fit flex-col rounded-xl text-blue items-center ${(disabled) ? "opacity-70" : ""}`}>
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
      <Draggable id={dragId}>
        <Droppable id={dropId}>
          <div
            className={`flex h-fit flex-col rounded-xl text-blue items-center ${(disabled) ? "opacity-70" : ""}`}>
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
  if (type === InodeType.TRASH || type === InodeType.HOME) {
    return (
      <Droppable id={dropId}>
        <div
          className={`flex h-fit flex-col rounded-xl text-blue items-center ${(disabled) ? "opacity-70" : ""}`}>
          <div className={`m-1 relative rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
            <Icon inode={inode} />
          </div>
          <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
            {inode.name}
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
