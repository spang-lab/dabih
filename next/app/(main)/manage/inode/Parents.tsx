
import { ChevronRight, Folder } from "react-feather";
import Droppable from "./Droppable";
import useFiles from "@/lib/hooks/files";

export default function Parents() {
  const parents = useFiles((state) => state.parents);
  const list = useFiles((state) => state.list);

  const reverse = [...parents].reverse();

  if (parents.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-start flex-wrap border-t py-1 border-gray-200">
      {reverse.map((inode) => (
        <Droppable id={`parent-${inode.mnemonic}`} key={inode.mnemonic}>
          <div
            className="flex rounded-sm flex-row px-3 text-xs font-bold text-blue items-center hover:bg-blue/10 cursor-pointer"
            onClick={() => void list(inode.mnemonic).catch(console.error)}
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
