import { InodeMembers, Member, Permission } from "@/lib/api/types";
import useFinder from "../Context";
import { Folder, Trash2, User } from "react-feather";
import { Switch } from "@/app/util";

const getPermission = (permission: Permission) => {
  switch (permission) {
    case Permission.READ:
      return "Read";
    case Permission.WRITE:
      return "Read & Write";
    default:
      return "None";
  }
}



export default function MemberItem({
  inode,
  member,
  readOnly,
  isParent,
}: {
  inode: InodeMembers,
  member: Member,
  readOnly: boolean,
  isParent: boolean,
}) {
  const { users } = useFinder();

  const memberInfo = users[member.sub];
  if (!memberInfo) {
    return null;
  }
  const { sub, name, email } = memberInfo;
  const enabled = member.permission === Permission.WRITE;

  const toggle = async () => {
    if (readOnly) {
      return;
    }
    if (member.permission === Permission.WRITE) {
      console.log('new permission read');
    }
    if (member.permission === Permission.READ) {
      console.log('new permission write');
    }
  }

  const getEdit = () => {
    if (readOnly) {
      return <div className="text-gray-400 whitespace-nowrap">
        {getPermission(member.permission)}
      </div>;
    }
    return (
      <div className="flex shrink-0">
        <div className="flex flex-col">
          <Switch enabled={enabled} onChange={toggle} />
          <div className="text-gray-400 text-xs whitespace-nowrap pt-1">
            Can edit
          </div>
        </div>
        <div>
          <button
            type="button"
            aria-label="Delete Member"
            className="bg-red text-white ml-1 px-2 py-1 rounded-lg"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  }

  const getParent = () => {
    if (!isParent) {
      return (
        <div className="flex items-center text-xs text-gray-600">
          direct access
        </div>
      )
    }
    return (
      <div className="flex items-center text-xs text-gray-600">
        from
        <Folder size={14} className="fill-blue/40 mx-1 text-blue" />
        {inode.name}
      </div>
    );
  };


  return (
    <div className={`flex items-center px-2 py-1 space-x-2 text-sm ${(isParent) ? "bg-gray-50" : ""}`}>
      <div className="pr-1 shrink-0 text-blue">
        <User size={20} />
      </div>
      <div className="font-medium grow">
        {name}
        {' '}
        <a href={`mailto:${email}`} className="text-blue hover:underline text-xs">
          {email}
        </a>
        {getParent()}
      </div>
      {getEdit()}
    </div>
  );

}
