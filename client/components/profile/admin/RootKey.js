import React from 'react';
import { Cpu } from 'react-feather';
import useDialog from '../../dialog';
import { useProfile } from '../Context';

export default function RootKey() {
  const { openDialog, dialog } = useDialog();
  const { addRootKey } = useProfile();
  const onGenerate = async (publicKey) => {
    if (publicKey.error) {
      dialog.error(publicKey.error);
      return;
    }
    await addRootKey(publicKey);
  };

  return (
    <div className="m-2">
      <button
        className="px-2 py-1 bg-blue text-white rounded-lg"
        type="button"
        onClick={() => openDialog('generate', {
          shake: true,
          onSubmit: onGenerate,
        })}
      >
        <span className="whitespace-nowrap font-bold">
          <Cpu className="inline-block mr-2 mb-1" size={18} />
          Generate a new root key
        </span>
      </button>
    </div>
  );
}
