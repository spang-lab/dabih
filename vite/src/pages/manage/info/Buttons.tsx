
import useFiles from "@/lib/hooks/files";
import useFinder from "../Context";
import useTransfers from "@/lib/hooks/transfers";
import useSession from "@/Session";
import { InodeType, Permission } from "@/lib/api/types";
import { AlertOctagon, DownloadCloud, Trash2 } from "react-feather";




export default function Buttons() {
  const { user, key } = useSession();
  const { selected, remove, destroy } = useFinder();
  const download = useTransfers((state => state.download));
  const nodes = useFiles((state) => state.nodes);
  const parents = useFiles((state) => state.parents);
  const set = new Set(selected);
  const selectedNodes = nodes.filter((node) => set.has(node.mnemonic));


  if (selectedNodes.length === 0 || !user) {
    return null;
  }
  const parentPermissions = new Set(
    parents.flatMap((parent) =>
      parent.members
        .filter((member) => member.sub === user.sub)
        .map((member) => member.permission)
    )
  );

  const isInTrash = parents.some(p => p.type === InodeType.TRASH);

  let canDownload = true;
  let canDelete = true;
  const mnemonics = selectedNodes.map((node) => node.mnemonic);

  selectedNodes.forEach((node) => {
    const { type, members } = node;
    if (type !== InodeType.FILE && type !== InodeType.DIRECTORY) {
      canDownload = false;
      canDelete = false;
    }
    const permissions = new Set(members
      .filter((member) => member.sub === user.sub)
      .map((member) => member.permission));
    if (!permissions.has(Permission.WRITE) && !parentPermissions.has(Permission.WRITE)) {
      canDelete = false;
      if (!permissions.has(Permission.READ) && !parentPermissions.has(Permission.READ)) {
        canDownload = false;
      }
    }
  });
  if (!key) {
    canDownload = false;
  }


  return (
    <div className="flex space-x-2 p-3">
      <button
        type="button"
        disabled={!canDownload}
        className="w-full p-2 text-white bg-blue rounded-sm disabled:bg-blue/50 disabled:cursor-not-allowed inline-flex items-center"
        onClick={() => download(mnemonics, key!)}
      >
        <DownloadCloud className="mr-2" size={24} />
        Download
      </button>
      {isInTrash ? (
        <button
          type="button"
          disabled={!canDelete}
          onClick={() => destroy()}
          className="w-full p-2 text-white bg-red rounded-sm disabled:bg-red/50 disabled:cursor-not-allowed inline-flex items-center"
        >
          <Trash2 className="mr-2" size={24} />
          Delete forever
          <AlertOctagon className="ml-1 stroke-3" size={18} />
        </button>
      ) : (
        <button
          type="button"
          disabled={!canDelete}
          onClick={() => remove()}
          className="w-full p-2 text-white bg-red rounded-sm disabled:bg-red/50 disabled:cursor-not-allowed inline-flex items-center"
        >
          <Trash2 className="mr-2" size={24} />
          Delete
        </button>
      )}
    </div>
  );
}
