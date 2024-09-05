import { InodeMembers, Permission } from "@/lib/api/types";
import Member from "./Member";
import useFinder from "../Context";
import AddMember from "./AddMember";

export default function Members({ inode }: { inode: InodeMembers }) {
  const { members } = inode;
  const { user } = useFinder();
  if (!user) {
    return null;
  }

  const entry = members.find((member) => member.sub === user.sub);
  const permission = entry ? entry.permission : Permission.NONE;

  return (
    <div className="px-3">
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-semibold"
        >
          Members
        </h3>
        <div className="text-sm font-medium px-3">
          {members.length} total
        </div>
      </div>

      <div className="max-h-72 overflow-y-scroll border rounded divide-y">
        {members.map((member) => (
          <Member
            key={member.sub}
            inode={inode}
            member={member}
            readOnly={permission !== Permission.WRITE}
          />
        ))}
      </div>
      <AddMember hidden={permission !== Permission.WRITE} inode={inode} />
    </div>
  );

}
