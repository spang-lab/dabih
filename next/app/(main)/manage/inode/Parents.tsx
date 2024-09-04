
import { ChevronRight, Folder } from "react-feather";
import useFinder from "../Context";
import Droppable from "./Droppable";

export default function Parents() {
  const { parents, list } = useFinder();

  const reverse = [...parents].reverse();

  return (
    <div className="flex justify-start flex-wrap">
      <div>
        <Droppable id="__root__">
          <div
            className="flex px-3 rounded flex-row text-xs font-bold text-blue items-center hover:bg-blue/10 cursor-pointer"
            onDoubleClick={() => list(null)}
          >
            <Folder
              className="fill-blue/40"
              size={26} strokeWidth={1} />
            root
          </div>
        </Droppable>
      </div>
      {reverse.map((inode) => (
        <div key={inode.mnemonic}>
          <Droppable id={inode.mnemonic}>
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
        </div>
      ))
      }
    </div >
  );
}
