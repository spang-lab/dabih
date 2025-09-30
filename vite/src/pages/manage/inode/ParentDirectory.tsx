
import { ArrowUp, Folder } from "react-feather";
import Droppable from "./Droppable";
import useFiles from "@/lib/hooks/files";
import useSession from "@/Session";
import { InodeType } from "@/lib/api/types";

export default function ParentDirectory() {
  const parents = useFiles((state) => state.parents);
  const list = useFiles((state) => state.list);

  const { user } = useSession();
  const current = parents[0];
  const parent = parents[1];
  if (!parent || !current || !user) {
    return null;
  }
  const { sub } = user

  const isMember = current.members?.some((m) => m.sub === sub);
  const isHome = current.type === InodeType.HOME;

  let mnemonic;
  if (isMember && !isHome) {
    mnemonic = null;
  } else {
    mnemonic = parent.mnemonic;
  }

  const dropId = `drop-${mnemonic}`;
  return (
    <Droppable id={dropId}>
      <div
        onDoubleClick={() => void list(mnemonic).catch(console.error)}
        className="w-32 flex h-fit flex-col rounded-xl text-blue items-center hover:bg-blue/10 cursor-pointer select-none">
        <div className="m-1 rounded-lg" >
          <div className="relative">
            <Folder size={85} strokeWidth={0.5} className="fill-blue/40 " />
            <ArrowUp size={40} strokeWidth={2} className="absolute bottom-5 left-6" />
          </div>
        </div>
        <div className="max-w-full px-1 rounded-sm">
          ..
        </div>
      </div>
    </Droppable >
  );

}
