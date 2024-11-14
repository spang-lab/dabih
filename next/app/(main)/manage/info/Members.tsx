import { InodeMembers, Permission } from "@/lib/api/types";
import Member from "./Member";
import useFinder from "../Context";
import AddMember from "./AddMember";
import { Pluralize } from "@/app/util";
import { DownloadCloud, Trash2 } from "react-feather";

export default function Members({ inode }: { inode: InodeMembers }) {
  const { user, parents, search } = useFinder();
  if (!user || search.isActive) {
    return null;
  }

  const nodes = [inode, ...parents].reverse();


  const writeIdx = nodes.findIndex((node) =>
    node.members.find((member) => member.sub === user.sub && member.permission === Permission.WRITE));

  let hasRead = false;
  const entries = nodes.flatMap((node, idx) => {
    return node.members.map((member) => {
      if (member.sub === user.sub) {
        hasRead = true;
      }
      return {
        key: `${node.mnemonic}-${member.sub}`,
        inode: node,
        member,
        readOnly: writeIdx === -1 || idx < writeIdx,
        isParent: node.mnemonic !== inode.mnemonic,
      };
    });
  }).sort((m1, m2) => m1.member.sub.localeCompare(m2.member.sub));

  const hasWrite = writeIdx !== -1;


  return (
    <div className="px-3">
      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-semibold"
        >
          Access
        </h3>
        <div className="text-sm font-medium px-3">
          {entries.length}
          <Pluralize count={entries.length}> user</Pluralize>
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
      <AddMember hidden={!hasWrite} inode={inode} />
      <div className="flex space-x-2 mt-2">
        <button
          type="button"
          disabled={!hasRead}
          className="w-full p-2 text-white bg-blue rounded disabled:bg-blue/50 disabled:cursor-not-allowed inline-flex items-center"
        >
          <DownloadCloud className="mr-2" size={24} />
          Download
        </button>
        <button
          type="button"
          disabled={!hasWrite}
          className="w-full p-2 text-white bg-red rounded disabled:bg-red/50 disabled:cursor-not-allowed inline-flex items-center"
        >
          <Trash2 className="mr-2" size={24} />
          Delete
        </button>
      </div>
    </div>
  );

}
