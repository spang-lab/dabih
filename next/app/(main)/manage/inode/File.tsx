
import { InodeMembers } from "@/lib/api/types";
import Icon from "./Icon";
import FileName from "./Filename";

export default function File({
  data: node,
  selected,
}: {
  id: string,
  data: InodeMembers,
  selected: boolean
}) {
  const { name } = node;
  return (
    <div
      className="flex h-fit flex-col rounded-xl text-blue items-center">
      <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
        <Icon fileName={name} />
      </div>
      <div className={`max-w-full px-1 rounded ${(selected) ? "text-white bg-blue/90" : ""}`}>
        <FileName fileName={name} />
      </div>
    </div>
  );
}

