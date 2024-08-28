
import { DragOverlay } from "@dnd-kit/core";
import { File } from "react-feather";
import Inode from "./inode/Inode";
import { InodeMembers } from "@/lib/api/types";


export default function Overlay({ inodes }
  : { inodes: InodeMembers[] }
) {

  if (!inodes.length) {
    <DragOverlay />
  }
  if (inodes.length === 1) {
    const inode = inodes[0];
    return (
      <DragOverlay>
        <Inode data={inode} selected={false} />
      </DragOverlay>
    );
  }
  if (inodes.length === 2) {
    return (
      <DragOverlay>
        <div className="w-32 flex flex-col border items-center">
          <div className="relative">
            <File className="fill-white" size={80} strokeWidth={0.5} />
            <File className="absolute bottom-2 left-2 fill-blue/20 " strokeWidth={0.5} size={80} />
          </div>
          <div className="text-center text-sm font-bold">
            {inodes.length} items
          </div>
        </div>
      </DragOverlay>
    );
  }

  return (
    <DragOverlay>
      <div className="w-32 flex flex-col border items-center">
        <div className="relative">
          <File className="fill-white" size={80} strokeWidth={0.5} />
          <File className="absolute bottom-2 left-2 fill-blue/20 " strokeWidth={0.5} size={80} />
          <File className="absolute bottom-4 left-4 fill-blue/20" strokeWidth={0.5} size={80} />
        </div>
        <div className="text-center text-sm font-bold">
          {inodes.length} items
        </div>
      </div>
    </DragOverlay>
  );

}
