import { InodeMembers, Permission } from "@/lib/api/types";
import Member from "./Member";
import useFinder from "../Context";
import AddMember from "./AddMember";
import { Pluralize } from "@/app/util";

export default function Members({ inode }: { inode: InodeMembers }) {
  const { members } = inode;
  const { user, parents } = useFinder();
  if (!user) {
    return null;
  }

  const nodes = [inode, ...parents].reverse();

  const writeIdx = nodes.findIndex((node) =>
    node.members.find((member) => member.sub === user.sub && member.permission === Permission.WRITE));

  const entries = nodes.flatMap((node, idx) => {
    return node.members.map((member) => {
      return {
        key: `${node.mnemonic}-${member.sub}`,
        inode: node,
        member,
        readOnly: writeIdx === -1 || idx < writeIdx,
        isParent: node.mnemonic !== inode.mnemonic,
      };
    });
  }).sort((m1, m2) => m1.member.sub.localeCompare(m2.member.sub));


  return (
    <div className="px-3">
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-semibold"
        >
          Access
        </h3>
        <div className="text-sm font-medium px-3">
          {members.length}
          <Pluralize count={members.length}> user</Pluralize>
        </div>
      </div>

      <div className="max-h-72 overflow-y-scroll border rounded divide-y">
        {entries.map((e) => (
          <Member
            key={e.key}
            inode={e.inode}
            member={e.member}
            readOnly={e.readOnly}
            isParent={e.isParent}
          />
        ))}
      </div>
      <AddMember hidden={writeIdx !== -1} inode={inode} />
    </div>
  );

}
