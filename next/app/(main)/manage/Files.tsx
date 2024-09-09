"use client";

import { InodeType } from "@/lib/api/types";

import Inode from "./inode/Inode";
import DragOverlay from "./DragOverlay";
import ParentDirectory from "./inode/ParentDirectory";
import Parents from "./inode/Parents";
import useFinder from "./Context";



export default function Files() {
  const {
    openMenu,
    nodes,
    selected,
    setSelected,
    list
  } = useFinder();

  const style = {
    height: "calc(100vh - 300px)",
  };

  return (
    <div
      style={style}
      className="overflow-y-scroll justify-stretch flex flex-col bg-gray-50 shadow-inner rounded-xl px-3 pt-3 select-none"
      onContextMenu={(e) => {
        e.preventDefault();
        setSelected([]);
        openMenu({ left: e.clientX, top: e.clientY });
      }}
    >

      <div className="flex flex-1 flex-row flex-wrap content-start ">
        <ParentDirectory />
        {nodes.map((inode) => (
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
              if ([InodeType.FILE, InodeType.UPLOAD].includes(inode.type)) {
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
            <Inode
              inode={inode}
              selected={selected.includes(inode.mnemonic)}
            />
          </div>
        ))}
        <DragOverlay />
      </div>
      <Parents />
    </div>
  );
}
