
import { ArrowUp, Folder } from "react-feather";
import Droppable from "./Droppable";

export default function ParentDirectory({
  mnemonic,
  selected,
}: {
  mnemonic?: string,
  selected?: boolean
}) {
  return (
    <Droppable id={mnemonic ?? "__root__"}>
      <div
        className="w-32 flex h-fit flex-col rounded-xl text-blue items-center">
        <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
          <div className="relative">
            <Folder size={85} strokeWidth={0.5} className="fill-blue/40 " />
            <ArrowUp size={40} strokeWidth={2} className="absolute bottom-5 left-6" />
          </div>
        </div>
        <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
          ..
        </div>
      </div>
    </Droppable>
  );

}
