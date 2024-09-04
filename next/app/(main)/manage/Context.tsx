"use client";

import React, { createContext, useState, useContext, useMemo, useCallback, useEffect, useRef } from 'react';
import { DndContext, DragStartEvent, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import api from '@/lib/api';
import useKey from '@/lib/hooks/key';
import crypto from '@/lib/crypto';

import { InodeMembers, ListResponse } from '@/lib/api/types';
import Menu from './Menu';

interface FinderContextType {
  nodes: InodeMembers[],
  parents: InodeMembers[],
  selected: string[],
  setSelected: (selected: string[]) => void,
  position: { left: number, top: number },
  addFolder: () => void,
  remove: () => void,
  rename: (mnemonic: string, name: string) => void,
  list: (mnemonic: string | null) => void,
  openMenu: (position: { left: number, top: number }) => void,
}

const nf = () => {
  throw new Error("FinderContext not initialized");
};

const FinderContext = createContext<FinderContextType>({
  nodes: [],
  parents: [],
  selected: [],
  setSelected: nf,
  position: { left: 0, top: 0 },
  addFolder: nf,
  remove: nf,
  rename: nf,
  list: nf,
  openMenu: nf,
});

export function FinderWrapper({ children }) {
  const key = useKey();
  const [listData, setListData] = useState<ListResponse | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const menuButton = useRef<HTMLDivElement>(null);

  const openMenu = useCallback((p: { left: number, top: number }) => {
    setPosition(p);
    menuButton.current?.click();
  }, []);

  const nodes = useMemo(() => listData?.children ?? [], [listData]);
  const parents = useMemo(() => listData?.parents ?? [], [listData]);
  const cwd = useMemo(() => parents[0]?.mnemonic ?? null, [parents]);

  const list = useCallback(async (mnemonic: string | null) => {
    const { data, error } = await api.fs.list(mnemonic);
    if (!data || error) {
      return;
    }
    setListData(data);
  }, []);

  const addFolder = useCallback(async () => {
    let name = "untitled_folder";
    let count = 1;
    while (nodes.find((inode) => inode.name === name)) {
      name = `untitled_folder_${count}`;
      count += 1;
    }
    await api.fs.addDirectory(name, cwd ?? undefined);
    await list(cwd);
  }, [cwd, nodes, list]);

  const remove = useCallback(async () => {
    const promises = selected.map(async (mnemonic) => {
      await api.fs.remove(mnemonic);
    });
    await Promise.all(promises);
    await list(cwd);
  }, [list, selected, cwd]);

  const rename = useCallback(async (mnemonic: string, name: string) => {
    await api.fs.move({ mnemonic, name });
    await list(cwd);
  }, [list, cwd]);



  const move = useCallback(async (mnemonics: string[], target: string) => {
    if (target === '__root__') {
      const promises = mnemonics.map(async (mnemonic) => {
        await api.fs.move({ mnemonic, parent: null });
      });
      await Promise.all(promises);
      await list(cwd);
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
      await list(cwd);

    });
    await Promise.all(promises);
  }, [key, cwd, list]);


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
    list(null).catch(console.error);
  }, [list]);

  const value = useMemo(() => ({
    nodes,
    parents,
    selected,
    setSelected,
    position,
    setPosition,
    addFolder,
    remove,
    rename,
    list,
    openMenu,
  }), [
    nodes,
    parents,
    selected,
    setSelected,
    position,
    addFolder,
    remove,
    rename,
    list,
    openMenu,
  ]);

  return (
    <FinderContext.Provider value={value}>
      <Menu ref={menuButton} />
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        {children}
      </DndContext>
    </FinderContext.Provider>
  );
}

const useFinder = () => useContext(FinderContext);
export default useFinder;


