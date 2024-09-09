
import { DragOverlay } from "@dnd-kit/core";
import { File } from "react-feather";
import Node from "./inode/Node";
import useFinder from "./Context";


export default function Overlay() {
  const { nodes, selected } = useFinder();
  if (!selected.length) {
    <DragOverlay />
  }
  if (selected.length === 1) {
    const inode = nodes.find((inode) => inode.mnemonic === selected[0]);
    return (
      <DragOverlay>
        <Node inode={inode!} selected={false} />
      </DragOverlay>
    );
  }
  if (selected.length === 2) {
    return (
      <DragOverlay>
        <div className="w-32 flex flex-col items-center">
          <div className="relative">
            <File className="fill-white" size={80} strokeWidth={0.5} />
            <File className="absolute bottom-2 left-2 fill-blue/20 " strokeWidth={0.5} size={80} />
          </div>
          <div className="text-center text-sm font-bold">
            {selected.length} items
          </div>
        </div>
      </DragOverlay>
    );
  }

  return (
    <DragOverlay>
      <div className="w-32 flex flex-col items-center">
        <div className="relative">
          <File className="fill-white" size={80} strokeWidth={0.5} />
          <File className="absolute bottom-2 left-2 fill-blue/20 " strokeWidth={0.5} size={80} />
          <File className="absolute bottom-4 left-4 fill-blue/20" strokeWidth={0.5} size={80} />
        </div>
        <div className="text-center text-sm font-bold">
          {selected.length} items
        </div>
      </div>
    </DragOverlay>
  );

}
