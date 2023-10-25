'use client';

import { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import Upload from './Upload';
import useApi from './Api';

export default function Open() {
  const { isReady } = useApi();
  const [files, setFiles] = useState<any[]>([]);
  const [zip, setZip] = useState<boolean>(true);
  const toggleZip = () => setZip(!zip);

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
      const paths: string[] = await invoke('scan', {
        files: selected,
        zip,
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
      <div className="flex flex-row py-1">
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
          className="bg-blue mx-1 text-white px-3 py-1 rounded-md"
        >
          Upload Directory...
          <p className="text-[10px]">
            {(zip) ? 'as zip' : 'recursively'}
          </p>
        </button>
        <div className="flex flex-row items-center px-2">
          <Switch
            checked={zip}
            onChange={toggleZip}
            className={`${zip ? 'bg-blue' : 'bg-gray-400'}
            relative inline-flex h-[20px] w-[38px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span
              aria-hidden="true"
              className={`${zip ? 'translate-x-4' : 'translate-x-0'}
              pointer-events-none inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <span className="text-xs font-bold pl-3">
            Zip directories
            <br />
            before upload
          </span>
        </div>

      </div>

      <div>
        {files.map((f) => <Upload key={f.path} data={f} />)}
      </div>
    </div>
  );
}
