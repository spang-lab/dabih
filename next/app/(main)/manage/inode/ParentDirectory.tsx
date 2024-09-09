
import { ArrowUp, Folder } from "react-feather";
import Droppable from "./Droppable";
import useFinder from "../Context";

export default function ParentDirectory() {
  const { parents, list } = useFinder();
  const parent = parents[1];
  if (!parent) {
    return null;
  }
  const { mnemonic } = parent;
  const dropId = `drop-${mnemonic}`;
  return (
    <Droppable id={dropId}>
      <div
        onDoubleClick={() => list(mnemonic)}
        className="w-32 flex h-fit flex-col rounded-xl text-blue items-center">
        <div className="m-1 rounded-lg" >
          <div className="relative">
            <Folder size={85} strokeWidth={0.5} className="fill-blue/40 " />
            <ArrowUp size={40} strokeWidth={2} className="absolute bottom-5 left-6" />
          </div>
        </div>
        <div className="max-w-full px-1 rounded">
          ..
        </div>
      </div>
    </Droppable>
  );

}
