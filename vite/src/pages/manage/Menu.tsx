
import { AlertOctagon, Copy, Download, FolderPlus, Trash2 } from "react-feather";
import useFinder from "./Context";
import { useEffect, useRef } from "react";
import useTransfers from "@/lib/hooks/transfers";
import useSession from "@/Session";

export default function OptionsMenu() {
  const { key } = useSession();
  const {
    menu,
    setMenu,
    selected,
    addFolder,
    remove,
    destroy,
    duplicate,
    actions,
  } = useFinder();
  const ref = useRef<HTMLDivElement>(null);
  const download = useTransfers((state => state.download));
  const position = {
    left: menu.left,
    top: menu.top,
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const node = event.target as Node;
      const elem = ref.current;
      if (elem && !elem.contains(node)) {
        setMenu({ top: 0, left: 0, open: false });
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [setMenu]);


  if (!menu.open) {
    return null;
  }


  return (
    <div ref={ref}>
      <div
        className="w-52 z-10 absolute rounded-sm border border-gray-300 bg-white p-1 text-sm/6 text-blue transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
        style={position}>
        <div>
          <button
            onClick={() => {
              addFolder();
              setMenu({ top: 0, left: 0, open: false });
            }}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40">
            <FolderPlus className="text-blue" />
            New Folder
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              download(selected, key!);
              setMenu({ top: 0, left: 0, open: false });
            }}
            disabled={!actions.has("download") || !key}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40 disabled:bg-white disabled:text-blue/40">
            <Download />
            Download
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              duplicate();
              setMenu({ top: 0, left: 0, open: false });
            }}
            disabled={!actions.has("duplicate")}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40 disabled:bg-white disabled:text-blue/40">
            <Copy />
            Duplicate
          </button>
        </div>
        <div className="my-1 h-px bg-gray-300" />
        <div>
          {actions.has("destroy") ? (
            <button
              type="button"
              disabled={!actions.has("destroy")}
              onClick={() => {
                destroy()
                setMenu({ top: 0, left: 0, open: false });
              }}
              className="group flex w-full items-center text-red gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40 disabled:bg-white disabled:text-red/40"
            >
              <Trash2 size={24} />
              Delete forever
              <AlertOctagon className="stroke-3" size={18} />
            </button>
          ) : (
            <button
              type="button"
              disabled={!actions.has("remove")}
              onClick={() => {
                remove()
                setMenu({ top: 0, left: 0, open: false });
              }}
              className="group flex w-full items-center text-red gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40 disabled:bg-white disabled:text-red/40"
            >
              <Trash2 className="mr-2" size={24} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

