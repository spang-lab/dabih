import React from 'react';
import { Cpu } from 'react-feather';
import { useDialog } from '@/components';
import { useUser } from '@/lib/hooks';

export default function RootKey() {
  const dialog = useDialog();
  const user = useUser();
  const onGenerate = async (publicKey) => {
    if (publicKey.error) {
      dialog.error(publicKey.error);
    }
    // await addRootKey(publicKey);
  };

  if (user.status !== 'authenticated' || !user.isAdmin) {
    return null;
  }

  return (
    <div className="m-2">
      <button
        className="px-2 py-1 bg-blue text-white rounded-lg"
        type="button"
        onClick={() => dialog.openDialog('generate', {
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
