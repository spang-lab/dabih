
import { Folder, Users } from "react-feather";
import useFiles from "@/lib/hooks/files";
import { InodeType } from "@/lib/api/types";
import useSession from "@/Session";

export default function SharedDirectory() {
  const { user } = useSession();

  const parents = useFiles((state) => state.parents);
  const shared = useFiles((state) => state.shared);
  const cwd = parents[0];
  if (!cwd || cwd.type !== InodeType.HOME
    || cwd.name !== user?.email
  ) {
    return null;
  }


  return (
    <div
      onDoubleClick={() => void shared().catch(console.error)}
      className="w-32 flex h-fit flex-col rounded-xl text-blue items-center">
      <div className="m-1 rounded-lg" >
        <div className="relative">
          <Folder size={85} strokeWidth={0.5} className="fill-blue/20 " />
          <Users size={40} strokeWidth={2} className="absolute bottom-5 left-6" />
        </div>
      </div>
      <div className="max-w-full px-1 text-sm rounded-sm">
        Shared with Me
      </div>
    </div>
  );

}
