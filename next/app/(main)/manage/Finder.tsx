"use client";

import { InodeMembers, InodeType, ListResponse } from "@/lib/api/types";
import { useCallback, useEffect, useRef, useState } from "react";

import api from "@/lib/api";
import Inode from "./inode/Inode";
import Menu from "./Menu";


import { DndContext, DragStartEvent, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import DragOverlay from "./DragOverlay";
import useKey from "@/lib/hooks/key";
import crypto from "@/lib/crypto";
import ParentDirectory from "./inode/ParentDirectory";



export default function Finder() {
  const key = useKey();

  const [cwd, setCwd] = useState<string | null>(null);
  const [listData, setListData] = useState<ListResponse | null>(null);
  const inodes = listData?.inodes ?? [];
  const cwdNode = listData?.node ?? null;
  const inodeDict: Record<string, InodeMembers> = inodes.reduce((acc, inode) => {
    acc[inode.mnemonic] = inode;
    return acc;
  }, {});
  const [selected, setSelected] = useState<string[]>([]);
  const menuButton = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0 });


  const list = useCallback(async () => {
    const { data, error } = await api.fs.list(cwd ?? null);
    if (!data || error) {
      return;
    }
    setListData(data);
  }, [cwd]);


  const addFolder = useCallback(async () => {
    let name = "untitled_folder";
    let count = 1;
    while (listData?.inodes.find((inode) => inode.name === name)) {
      name = `untitled_folder_${count}`;
      count += 1;
    }
    await api.fs.addDirectory(name, cwd ?? undefined);
    await list();
  }, [cwd, listData, list]);

  const remove = useCallback(async () => {
    const promises = selected.map(async (mnemonic) => {
      await api.fs.remove(mnemonic);
    });
    await Promise.all(promises);
    await list();
  }, [list, selected]);


  const move = useCallback(async (mnemonics: string[], target: string) => {
    if (target === '__root__') {
      const promises = mnemonics.map(async (mnemonic) => {
        await api.fs.move({ mnemonic, parent: null });
      });
      await Promise.all(promises);
      await list();
      return;
    }
    const promises = mnemonics.map(async (mnemonic) => {
      if (mnemonic === target) {
        return;
      }
      const { data: files, error } = await api.fs.listFiles(mnemonic);
      if (!files || error) {
        return;
      }
      if (key.status !== "active") {
        return;
      }
      const keyPromises = files.map(async (file) => {
        const aesKey = await crypto.file.decryptKey(key.key, file)
        return {
          mnemonic: file.mnemonic,
          key: await crypto.aesKey.toBase64(aesKey),
        }
      });
      const keys = await Promise.all(keyPromises);

      await api.fs.move({ mnemonic, parent: target, keys });
      await list();

    });
    await Promise.all(promises);
  }, [key, list]);

  const onRename = useCallback(async (mnemonic: string, name: string) => {
    await api.fs.move({ mnemonic, name });
    await list();
  }, [list]);


  const onDragStart = useCallback((event: DragStartEvent) => {
    const mnemonic = event.active.id as string;
    if (!selected.includes(mnemonic)) {
      setSelected([mnemonic]);
    }
  }, [selected]);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    if (!event.over) {
      return;
    }
    const target = event.over.id as string;
    move(selected, target).catch(console.error);
  }, [move, selected]);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    list().catch(console.error);
  }, [list]);


  return (
    <div className="flex flex-row">
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <div
          className="grow min-h-96 bg-gray-50 shadow-inner  border rounded-xl p-3 select-none"
          onContextMenu={(e) => {
            e.preventDefault();
            setSelected([]);
            setPosition({ left: e.clientX, top: e.clientY });
            menuButton.current?.click();
          }}
        >
          <Menu
            position={position}
            selected={selected}
            onAddFolder={addFolder}
            onDownload={() => { }}
            onRemove={remove}
            onRename={() => { }}
            onDuplicate={() => { }}
            ref={menuButton}
          />

          <div className="flex flex-wrap">
            <div
              className="h-fit select-none w-32"
              hidden={!cwd}
              onDoubleClick={() => setCwd(cwdNode?.parent?.mnemonic ?? null)}
            >
              <ParentDirectory mnemonic={cwdNode?.parent?.mnemonic} selected={false} />
            </div>

            {inodes.map((inode) => (
              <div
                className="h-fit w-32 select-none"
                key={inode.mnemonic}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (e.shiftKey || e.metaKey) {
                    const newSelected = [...selected].filter((mnemonic) => mnemonic !== inode.mnemonic);
                    if (selected.length === newSelected.length) {
                      newSelected.push(inode.mnemonic);
                    }
                    setSelected(newSelected);
                    return;
                  }
                  setSelected([inode.mnemonic]);
                }}
                onDoubleClick={() => {
                  if (inode.type === InodeType.DIRECTORY || inode.type === InodeType.TRASH) {
                    setCwd(inode.mnemonic);
                  }
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!selected.includes(inode.mnemonic)) {
                    setSelected([inode.mnemonic]);
                  }
                  setPosition({ left: e.clientX, top: e.clientY });
                  menuButton.current?.click();
                }}
              >
                <Inode
                  data={inode}
                  selected={selected.includes(inode.mnemonic)}
                  draggable
                  onRename={onRename}
                />
              </div>
            ))}
          </div>
          <DragOverlay inodes={selected.map((mnemonic) => inodeDict[mnemonic])} />
        </div>
        <div className="flex shrink-0 w-80 border flex-col">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
            File Info
          </h2>
          {selected.map((mnemonic) => (
            <div className="text-xs" key={mnemonic}>
              <pre>{JSON.stringify(inodeDict[mnemonic], null, 2)}</pre>
            </div>
          ))}
          Sidebar
        </div>
      </DndContext>
    </div>
  );
}
