'use client';

import { useEffect, useState } from 'react';
import Upload from './Upload';
import useApi from './Api';

export default function Open() {
  const { isReady } = useApi();
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
    const listenProgress = async () => {
      const { listen } = await import('@tauri-apps/api/event');
      const unlisten = await listen<any>('upload_progress', ({ payload }) => {
        const { mnemonic, current, total } = payload;
        setFiles(((oldFiles) => oldFiles.map((f) => {
          if (f.mnemonic !== mnemonic) {
            return f;
          }
          const state = (current < total) ? 'uploading' : 'complete';
          return {
            ...f,
            current,
            total,
            state,
          };
        })));
      });
      return unlisten;
    };

    const unlistenPromise = listenProgress();
    return () => {
      unlistenPromise.then((unlisten) => unlisten());
    };
  }, []);

  useEffect(() => {
    const checkFiles = async () => {
      const { invoke } = await import('@tauri-apps/api');
      const active = files.find((f) => f.state === 'uploading');
      if (active) {
        return;
      }

      const newUpload = files.find((f) => f.state === 'waiting');
      if (!newUpload) {
        return;
      }
      const { path, id } = newUpload;
      const mnemonic = await invoke('upload', {
        file: path,
        name: 'hello',
      });
      const newFiles = files.map((f) => {
        if (f.id !== id) {
          return f;
        }
        if (!mnemonic) {
          return {
            ...f,
            state: 'skipped',
          };
        }
        return {
          ...f,
          mnemonic,
          state: 'uploading',
        };
      });
      setFiles(newFiles);
    };
    checkFiles();
  }, [files]);

  const onClick = (directory: boolean) => {
    const openDialog = async () => {
      const { open } = await import('@tauri-apps/api/dialog');
      const { invoke } = await import('@tauri-apps/api');
      let selected = await open({
        multiple: !directory,
        directory,
      });
      if (!selected) {
        return;
      }
      if (!Array.isArray(selected)) {
        selected = [selected];
      }
      const paths:string[] = await invoke('scan', {
        files: selected,
      });

      const data = paths.map((p) => {
        const rand = Math.floor(Math.random() * 16 ** 5).toString(16);
        const id = `${p}-${rand}`;
        return {
          id,
          path: p,
          state: 'waiting',
          mnemonic: null,
          current: 0,
          total: null,
        };
      });

      const newFiles = [
        ...files,
        ...data,
      ];
      setFiles(newFiles);
    };
    openDialog();
  };
  if (!isReady) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl fong-extrabold">
        Select
        {' '}
        <span className="text-blue">your files</span>
      </h2>
      <button
        type="button"
        onClick={() => onClick(false)}
        className="bg-blue mx-1 text-white px-3 py-2 rounded-md"
      >
        Upload Files...
      </button>
      <button
        type="button"
        onClick={() => onClick(true)}
        className="bg-blue mx-1 text-white px-3 py-2 rounded-md"
      >
        Upload Directory...
      </button>
      <div>
        {files.map((f) => <Upload key={f.path} data={f} />)}
      </div>
    </div>
  );
}
