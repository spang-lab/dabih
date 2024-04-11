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
        const {
          id, state, mnemonic, current, total, message,
        } = payload;
        setFiles(((oldFiles) => oldFiles.map((f) => {
          if (f.id !== id) {
            return f;
          }
          return {
            ...f,
            current,
            total,
            mnemonic,
            state,
            message,
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
      const activeStates = ['gzip', 'uploading'];
      const active = files.find((f) => activeStates.includes(f.state));
      if (active) {
        return;
      }

      const newUpload = files.find((f) => f.state === 'waiting');
      if (!newUpload) {
        return;
      }
      const { path, id } = newUpload;
      await invoke('upload', {
        file: path,
        id,
      });
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
        const rand = Math.floor(Math.random() * 16 ** 8).toString(16);
        const id = `${rand}`;
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
