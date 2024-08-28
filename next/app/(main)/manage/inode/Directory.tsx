
import { InodeMembers } from "@/lib/api/types";
import { Folder } from "react-feather";
import FileName from "./Filename";


export default function Directory({
  data: node,
  selected,
}: {
  data: InodeMembers,
  selected: boolean
}) {
  const { name } = node;
  return (
    <div
      className="flex h-fit flex-col rounded-xl text-blue items-center">
      <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
        <Folder size={85} strokeWidth={0.5} className="fill-blue/60 " />
      </div>
      <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
        <FileName fileName={name} />
      </div>
    </div>
  );
}
