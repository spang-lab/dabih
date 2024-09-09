
import { ChevronRight, Folder } from "react-feather";
import useFinder from "../Context";
import Droppable from "./Droppable";

export default function Parents() {
  const { parents, list } = useFinder();

  const reverse = [...parents].reverse();

  return (
    <div className="flex justify-start flex-wrap border-t py-1">
      {reverse.map((inode) => (
        <Droppable id={`parent-${inode.mnemonic}`} key={inode.mnemonic}>
          <div
            className="flex rounded flex-row px-3 text-xs font-bold text-blue items-center hover:bg-blue/10 cursor-pointer"
            onDoubleClick={() => list(inode.mnemonic)}
          >
            <ChevronRight className="mr-3" size={26} strokeWidth={1} />
            <Folder
              className="fill-blue/40 mr-1"
              size={26} strokeWidth={1} />
            {inode.name}
          </div>
        </Droppable>
      ))
      }
    </div >
  );
}
