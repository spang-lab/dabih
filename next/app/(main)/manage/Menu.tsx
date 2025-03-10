
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { Copy, Download, Edit3, FolderPlus, Trash2 } from "react-feather";
import { ForwardedRef, forwardRef } from "react";
import useFinder from "./Context";

function OptionsMenu(props, ref: ForwardedRef<HTMLDivElement>) {
  const {
    position,
    selected,
    addFolder,
    remove,
  } = useFinder();
  const noneSelected = selected.length === 0;
  const oneSelected = selected.length === 1;
  return (
    <Menu>
      <MenuButton>
        <div hidden ref={ref}>Menu</div>
      </MenuButton>
      <MenuItems
        transition
        className="w-52 z-10 absolute rounded-sm border border-gray-300 bg-white p-1  text-sm/6 text-blue transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-hidden data-closed:scale-95 data-closed:opacity-0"
        style={position}>
        <MenuItem>
          <button
            onClick={addFolder}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-focus:bg-blue/40">
            <FolderPlus className="text-blue" />
            New Folder
          </button>
        </MenuItem>
        <MenuItem>
          <button
            //onClick={onDownload}
            disabled={noneSelected}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-focus:bg-blue/40 data-focus:disabled:bg-white disabled:text-blue/40">
            <Download />
            Download
          </button>
        </MenuItem>
        <MenuItem>
          <button
            //onClick={onRename}
            disabled={!oneSelected}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-focus:bg-blue/40 data-focus:disabled:bg-white disabled:text-blue/40">
            <Edit3 />
            Rename
          </button>
        </MenuItem>
        <MenuItem>
          <button
            //onClick={onDuplicate}
            disabled={!oneSelected}
            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-focus:bg-blue/40 data-focus:disabled:bg-white disabled:text-blue/40">
            <Copy />
            Duplicate
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-gray-300" />
        <MenuItem>
          <button
            onClick={remove}
            disabled={noneSelected}
            className="group flex w-full items-center text-red gap-2 rounded-lg py-1.5 px-3 data-focus:bg-blue/40 data-focus:disabled:bg-white disabled:text-red/40">
            <Trash2 />
            Delete
          </button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
export default forwardRef(OptionsMenu);
