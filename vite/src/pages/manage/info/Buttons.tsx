
import useFiles from "@/lib/hooks/files";
import useFinder from "../Context";
import useTransfers from "@/lib/hooks/transfers";
import useSession from "@/Session";
import { AlertOctagon, DownloadCloud, Trash2 } from "react-feather";




export default function Buttons() {
  const { user, key } = useSession();
  const { actions, selected, remove, destroy } = useFinder();
  const download = useTransfers((state => state.download));
  const nodes = useFiles((state) => state.nodes);
  const set = new Set(selected);
  const selectedNodes = nodes.filter((node) => set.has(node.mnemonic));


  if (selectedNodes.length === 0 || !user) {
    return null;
  }



  return (
    <div className="flex space-x-2 p-3">
      <button
        type="button"
        disabled={!actions.has("download") || !key}
        className="w-full p-2 text-white bg-blue rounded-sm disabled:bg-blue/50 disabled:cursor-not-allowed inline-flex items-center"
        onClick={() => download(selected, key!)}
      >
        <DownloadCloud className="mr-2" size={24} />
        Download
      </button>
      {actions.has("destroy") ? (
        <button
          type="button"
          disabled={!actions.has("destroy")}
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
          disabled={!actions.has("remove")}
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
