"use client";

import { InodeMembers } from "@/lib/api/types";
import { useEffect, useRef, useState } from "react";

import api from "@/lib/api";
import Inode from "./Inode";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { jsx } from "react/jsx-runtime";
import { Copy, Download, Edit3, FolderPlus, Trash2 } from "react-feather";

export default function Finder() {

  const [cwd, setCwd] = useState<InodeMembers | null>(null);
  const [inodes, setInodes] = useState<InodeMembers[]>([]);
  const [node, setNode] = useState<InodeMembers | null>(null);

  const menuButton = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const list = async () => {
      const { data, error } = await api.fs.list(cwd?.mnemonic ?? null);
      if (!data || error) {
        return;
      }
      setInodes(data);
    };
    list().catch(console.error);

  }, [cwd]);




  return (
    <div className="flex flex-row">
      <div
        className="flex flex-wrap h-fit bg-gray-50 shadow-inner  border rounded-xl p-3 "
        onContextMenu={(e) => {
          e.preventDefault();
          setNode(null);
          console.log("a");
          setMenuPos({ x: e.clientX, y: e.clientY });
          menuButton.current?.click();
        }}
      >
        <Menu>
          <MenuButton>
            <div hidden ref={menuButton}>Menu</div>
          </MenuButton>
          <MenuItems
            transition
            className="w-52 z-10 absolute rounded border border-gray-300 bg-white p-1  text-sm/6 text-blue transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            style={{
              top: menuPos.y,
              left: menuPos.x,
            }}>
            <MenuItem>
              <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-blue/40">
                <FolderPlus className="text-blue" />
                New Folder
              </button>
            </MenuItem>
            <MenuItem>
              <button disabled={!node} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-blue/40 data-[focus]:disabled:bg-white disabled:text-blue/40">
                <Download />
                Download
              </button>
            </MenuItem>
            <MenuItem>
              <button disabled={!node} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-blue/40 data-[focus]:disabled:bg-white disabled:text-blue/40">
                <Edit3 />
                Rename
              </button>
            </MenuItem>
            <MenuItem>
              <button disabled={!node} className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-blue/40 data-[focus]:disabled:bg-white disabled:text-blue/40">
                <Copy />
                Duplicate
              </button>
            </MenuItem>
            <div className="my-1 h-px bg-gray-300" />
            <MenuItem>
              <button disabled={!node} className="group flex w-full items-center text-red gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-blue/40 data-[focus]:disabled:bg-white disabled:text-red/40">
                <Trash2 />
                Delete
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>

        {inodes.map((inode) => (
          <div
            className="h-fit"
            key={inode.mnemonic}
            onClick={() => setNode(inode)}
            onContextMenu={(e) => {
              console.log("b");

              e.preventDefault();
              e.stopPropagation();
              setNode(inode);
              setMenuPos({ x: e.clientX, y: e.clientY });
              menuButton.current?.click();
            }}
          >
            <Inode
              data={inode}
              selected={node?.mnemonic === inode.mnemonic}
            />
          </div>
        ))}
      </div>
      <div className="flex shrink-0 w-80 border flex-col">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          File Info
        </h2>
        <pre>{JSON.stringify(node, null, 2)}</pre>
        Sidebar
      </div>
    </div>
  );
}
