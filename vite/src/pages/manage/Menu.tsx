
import { Copy, Download, Edit3, FolderPlus, Trash2 } from "react-feather";
import useFinder from "./Context";
import { useEffect, useRef } from "react";

export default function OptionsMenu() {
  const {
    menu,
    setMenu,
    selected,
    addFolder,
    remove,
  } = useFinder();
  const noneSelected = selected.length === 0;
  const oneSelected = selected.length === 1;
  const ref = useRef<HTMLDivElement>(null);
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

  const onRemove = () => {
    remove();
    setMenu({ top: 0, left: 0, open: false });
  }
  const onAddFolder = () => {
    addFolder();
    setMenu({ top: 0, left: 0, open: false });
  }

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
            onClick={onAddFolder}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40">
            <FolderPlus className="text-blue" />
            New Folder
          </button>
        </div>
        <div>
          <button
            //onClick={onDownload}
            disabled={noneSelected}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40 disabled:bg-white disabled:text-blue/40">
            <Download />
            Download
          </button>
        </div>
        <div>
          <button
            //onClick={onRename}
            disabled={!oneSelected}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40 disabled:bg-white disabled:text-blue/40">
            <Edit3 />
            Rename
          </button>
        </div>
        <div>
          <button
            //onClick={onDuplicate}
            disabled={!oneSelected}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40 disabled:bg-white disabled:text-blue/40">
            <Copy />
            Duplicate
          </button>
        </div>
        <div className="my-1 h-px bg-gray-300" />
        <div>
          <button
            onClick={onRemove}
            disabled={noneSelected}
            className="group flex w-full items-center text-red gap-2 rounded-lg py-1.5 px-3 hover:bg-blue/40 disabled:bg-white disabled:text-red/40">
            <Trash2 />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

