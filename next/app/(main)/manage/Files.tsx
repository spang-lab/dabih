"use client";

import Inode from "./inode/Inode";
import DragOverlay from "./DragOverlay";
import ParentDirectory from "./inode/ParentDirectory";
import Parents from "./inode/Parents";
import useFinder from "./Context";
import SearchHeader from "./inode/SearchHeader";



export default function Files() {
  const {
    openMenu,
    nodes,
    setSelected,
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
      <SearchHeader />
      <div className="flex flex-1 flex-row flex-wrap content-start ">
        <ParentDirectory />
        {nodes.map((inode) => (
          <Inode key={inode.mnemonic} inode={inode} />
        ))}
        <DragOverlay />
      </div>
      <Parents />
    </div >
  );
}
