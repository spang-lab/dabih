"use client";

import React, { createContext, useState, useContext, useMemo, useCallback, useEffect, useRef } from 'react';
import { DndContext, DragStartEvent, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import api from '@/lib/api';
import useKey from '@/lib/hooks/key';
import useSearch from '@/lib/hooks/search';
import crypto from '@/lib/crypto';

import { InodeMembers, ListResponse, UserResponse } from '@/lib/api/types';
import Menu from './Menu';
import useUsers from '@/lib/hooks/users';
import { User } from 'next-auth';

interface FinderContextType {
  user: User | null,
  nodes: InodeMembers[],
  parents: InodeMembers[],
  users: Record<string, UserResponse> | null,
  selected: string[],
  setSelected: (selected: string[]) => void,
  position: { left: number, top: number },
  addFolder: () => void,
  addMember: (mnemonic: string, sub: string) => void,
  remove: () => void,
  rename: (mnemonic: string, name: string) => void,
  list: (mnemonic: string | null) => void,
  openMenu: (position: { left: number, top: number }) => void,
  search: ReturnType<typeof useSearch>,
}

const FinderContext = createContext<FinderContextType>({} as FinderContextType);

export function FinderWrapper({ user, children }: {
  user: User,
  children: React.ReactNode,
}) {
  const key = useKey();
  const search = useSearch();
  const users = useUsers();
  const [listData, setListData] = useState<ListResponse | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const menuButton = useRef<HTMLDivElement>(null);

  const openMenu = useCallback((p: { left: number, top: number }) => {
    setPosition(p);
    menuButton.current?.click();
  }, []);


  const { nodes, parents, cwd } = useMemo(() => {
    if (search.isActive) {
      return { nodes: search.results, parents: [], cwd: null };
    }
    const nodes = listData?.children ?? [];
    const parents = listData?.parents ?? [];
    const cwd = parents[0]?.mnemonic ?? null;
    return { nodes, parents, cwd };
  }, [search, listData]);



  const list = useCallback(async (mnemonic: string | null) => {
    const { data, error } = await api.fs.list(mnemonic);
    if (!data || error) {
      return;
    }
    setListData(data);
    search.clear();
  }, []);

  const getKeys = useCallback(async (mnemonic: string) => {
    const { data, error } = await api.fs.listFiles(mnemonic);
    if (!data || error) {
      console.error(error);
      return;
    }
    if (key.status !== "active") {
      console.error("Key not active");
      return;
    }
    const keyPromises = data.map(async (file) => {
      const aesKey = await crypto.file.decryptKey(key.key, file)
      return {
        mnemonic: file.mnemonic,
        key: await crypto.aesKey.toBase64(aesKey),
      }
    });
    const keys = await Promise.all(keyPromises);
    return keys;
  }, [key]);



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

  const addMember = useCallback(async (mnemonic: string, sub: string) => {
    const keys = await getKeys(mnemonic);
    if (!keys) {
      return;
    }
    await api.fs.addMember(mnemonic, {
      subs: [sub],
      keys,
    });
    await list(cwd);
  }, [getKeys, cwd, list]);


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



  const move = useCallback(async (mnemonics: string[], target: string | null) => {
    if (!target) {
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
    const id = event.active.id as string;
    const mnemonic = id.split("-", 2)[1];
    if (!mnemonic) {
      throw new Error(`Invalid drag id ${id}`);
    }

    if (!selected.includes(mnemonic)) {
      setSelected([mnemonic]);
    }
  }, [selected]);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    if (!event.over) {
      return;
    }
    const id = event.over.id as string;
    const mnemonic = id.split("-", 2)[1] ?? null;

    move(selected, mnemonic).catch(console.error);
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
    user,
    nodes,
    parents,
    users,
    selected,
    setSelected,
    position,
    setPosition,
    addFolder,
    addMember,
    remove,
    rename,
    search,
    list,
    openMenu,
  }), [
    user,
    nodes,
    parents,
    users,
    selected,
    setSelected,
    position,
    addFolder,
    addMember,
    remove,
    rename,
    search,
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


