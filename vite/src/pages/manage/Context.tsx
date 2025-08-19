"use client";

import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { DndContext, DragStartEvent, DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import api from '@/lib/api';
import crypto from '@/lib/crypto';

import { InodeMembers, InodeType, Permission, UserResponse } from '@/lib/api/types';
import Menu from './Menu';
import useFiles from '@/lib/hooks/files';
import useSession from '@/Session';


type Action = "addFolder" | "addMember" | "remove" | "destroy" | "rename" | "download" | "duplicate";

const getActions = (selected: InodeMembers[], parents: InodeMembers[], user: UserResponse | null): Set<Action> => {
  const actions = new Set<Action>();
  if (!user) {
    return new Set();
  }
  const isFileOrFolder = selected.every((node) => node.type === InodeType.FILE || node.type === InodeType.DIRECTORY);
  const isInTrash = parents.some(p => p.type === InodeType.TRASH);

  const parentPermissions = new Set(
    parents.flatMap((parent) =>
      parent.members
        .filter((member) => member.sub === user.sub)
        .map((member) => member.permission)
    )
  );
  if (!isFileOrFolder || selected.length === 0) {
    if (parentPermissions.has(Permission.WRITE)) {
      actions.add("addFolder");
    }
    return actions;
  }
  if (parentPermissions.has(Permission.WRITE)) {
    actions.add("addFolder");
    actions.add("duplicate");
  }
  const nodesPermissions = selected.map((node) => {
    return new Set(
      node.members
        .filter((member) => member.sub === user.sub)
        .map((member) => member.permission)
    );
  });
  const nodePermissions = nodesPermissions.reduce((acc, permissions) => {
    acc.intersection(permissions);
    return acc;
  }, new Set(nodesPermissions[0]));

  if (nodePermissions.has(Permission.WRITE) || parentPermissions.has(Permission.WRITE)) {
    if (selected.length === 1) {
      actions.add("addMember");
      actions.add("rename");
    }
    if (isInTrash) {
      actions.add("destroy");
    } else {
      actions.add("remove");
    }
  }
  if (
    nodePermissions.has(Permission.WRITE) || parentPermissions.has(Permission.WRITE) ||
    nodePermissions.has(Permission.READ) || parentPermissions.has(Permission.READ)) {
    actions.add("download");
  }
  return actions;
}




interface FinderContextType {
  users: Record<string, UserResponse> | null,
  selected: string[],
  actions: Set<Action>,
  setSelected: (selected: string[]) => void,
  addFolder: () => Promise<void>,
  addMember: (mnemonic: string, sub: string) => Promise<void>,
  remove: () => Promise<void>,
  destroy: () => Promise<void>,
  duplicate: () => Promise<void>,
  rename: (mnemonic: string, name: string) => Promise<void>,
  list: (mnemonic: string | null) => Promise<void>,
  menu: { left: number, top: number, open: boolean },
  setMenu: (position: { left: number, top: number, open: boolean }) => void,
}

const FinderContext = createContext<FinderContextType>({} as FinderContextType);

export function FinderWrapper({ children }: {
  children: React.ReactNode,
}) {
  const { user, key } = useSession();
  const [users, setUsers] = useState<Record<string, UserResponse>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [menu, setMenu] = useState({ left: 0, top: 0, open: false });


  const nodes = useFiles((state) => state.nodes);
  const parents = useFiles((state) => state.parents);
  const cwd = useFiles((state) => state.cwd);
  const list = useFiles((state) => state.list);


  const actions = useMemo(() => {
    const set = new Set(selected);
    const selectedNodes = nodes.filter((node) => set.has(node.mnemonic));
    return getActions(selectedNodes, parents, user);
  }, [selected, nodes, parents, user]);






  const fetchUsers = useCallback(async () => {
    const { data, error } = await api.user.list();
    if (error || !data) {
      console.error(error);
      return;
    }
    const usersMap = data.reduce((acc: Record<string, UserResponse>, user: UserResponse) => {
      acc[user.sub] = user;
      return acc;
    }, {});
    setUsers(usersMap);
  }, []);


  const getKeys = useCallback(async (mnemonic: string) => {
    const { data, error } = await api.fs.listFiles(mnemonic);
    if (!data || error) {
      console.error(error);
      return;
    }
    if (!key) {
      console.error("No key available for decryption");
      return;
    }
    const keyPromises = data.map(async (file) => {
      const aesKey = await crypto.file.decryptKey(key, file)
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

  const destroy = useCallback(async () => {
    const promises = selected.map(async (mnemonic) => {
      await api.fs.destroy(mnemonic);
    });
    await Promise.all(promises);
    await list(cwd);
  }, [list, selected, cwd]);

  const rename = useCallback(async (mnemonic: string, name: string) => {
    await api.fs.move({ mnemonic, name });
    await list(cwd);
  }, [list, cwd]);

  const duplicate = useCallback(async () => {
    const promises = selected.map(async (mnemonic) => {
      await api.fs.duplicate(mnemonic)
    });
    await Promise.all(promises);
    await list(cwd);
  }, [selected, list, cwd]);




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
      if (!key) {
        return;
      }
      const keyPromises = files.map(async (file) => {
        const aesKey = await crypto.file.decryptKey(key, file)
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

  useEffect(() => {
    fetchUsers().catch(console.error);
  }, [fetchUsers]);

  const value = useMemo(() => ({
    users,
    selected,
    actions,
    setSelected,
    addFolder,
    addMember,
    remove,
    destroy,
    duplicate,
    rename,
    list,
    menu,
    setMenu,
  }), [
    users,
    selected,
    actions,
    setSelected,
    addFolder,
    addMember,
    remove,
    destroy,
    duplicate,
    rename,
    list,
    menu,
    setMenu,
  ]);

  return (
    <FinderContext.Provider value={value}>
      <Menu />
      <DndContext
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        sensors={sensors}
      >
        <pre> {Array.from(actions).join(", ")} </pre>
        {children}
      </DndContext>
    </FinderContext.Provider>
  );
}

const useFinder = () => useContext(FinderContext);
export default useFinder;


