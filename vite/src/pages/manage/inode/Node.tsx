import { InodeMembers } from "@/lib/api/types";

import Icon from "./Icon";
import FileName from "./Filename";

export default function Node({
  inode,
  selected,
}: {
  inode: InodeMembers,
  selected?: boolean,
}) {
  return (
    <div
      className="flex h-fit flex-col rounded-xl text-blue items-center">
      <div className={`m-1 rounded-lg ${(selected) ? "bg-blue/10" : ""}`}>
        <Icon inode={inode} />
      </div>
      <div className={`max-w-full px-1 rounded-sm ${(selected) ? "text-white bg-blue/90" : ""}`}>
        <FileName fileName={inode.name} />
      </div>
    </div>
  );

}
