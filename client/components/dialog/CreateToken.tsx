'use client';

import { useUser } from '@/lib/hooks';
import { Dialog, Listbox } from '@headlessui/react';
import { useState } from 'react';
import { Switch } from '../util';

const timeToSeconds = (timeString: string) => {
  const timeStr = timeString.toLowerCase();
  const oneHour = 60 * 60;
  const oneDay = 24 * oneHour;
  const unitMap = {
    h: oneHour,
    d: oneDay,
    w: 7 * oneDay,
    m: 31 * oneDay,
    y: 356 * oneDay,
  };
  const match = timeStr.match(/^(\d+)([hdwmy])$/);
  if (!match) {
    throw new Error(`invalid timeStr: ${timeStr}`);
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  return value * unitMap[unit];
};

function Scope({ scope, value, onChange }) {
  return (
    <div className="flex flex-row items-center justify-between border-b py-1 mx-3">
      <div className="font-mono">
        {scope}
      </div>
      <Switch enabled={value} onChange={(v) => onChange(scope, v)} />
    </div>
  );
}

export default function CreateToken({ ctx, closeDialog }) {
  const { onSubmit } = ctx;
  const user = useUser();
  const lifetimeOptions = [
    { label: 'never', value: null },
    { label: 'one hour', value: timeToSeconds('1h') },
    { label: 'one day', value: timeToSeconds('1d') },
    { label: 'one week', value: timeToSeconds('1w') },
    { label: 'one month', value: timeToSeconds('1m') },
    { label: 'six months', value: timeToSeconds('6m') },
    { label: 'one year', value: timeToSeconds('1y') },
  ];

  const submit = () => {
    if (onSubmit) {
      onSubmit();
    }
    closeDialog();
  };

  const [scopes, setScopes] = useState<any>(user.scopes.reduce((acc, scope) => {
    acc[scope] = true;
    return acc;
  }, {}));
  const [lifetime, setLifetime] = useState<any>(lifetimeOptions[0]);

  const setScope = (scope: string, value: boolean) => {
    const newScopes = {
      ...scopes,
    };
    newScopes[scope] = value;
    setScopes(newScopes);
  };

  if (user.status !== 'authenticated') {
    return null;
  }

  return (
    <Dialog.Panel className="w-full max-w-lg p-6 overflow-hidden text-left align-middle shadow-xl transform rounded-2xl transition-all border bg-gray-50 border-gray-300">
      <Dialog.Title
        as="h2"
        className="pb-3 text-2xl font-extrabold text-gray-800 leading-6"
      >
        New Access Token
      </Dialog.Title>
      <p className="pb-3">
        This token can be used by command line tools to perform
        actions in
        {' '}
        <span className="text-blue font-bold">dabih</span>
      </p>
      <h3 className="text-xl font-extrabold">Configure Scopes</h3>

      {Object.keys(scopes).map((scope) => (
        <Scope
          scope={scope}
          value={scopes[scope]}
          onChange={setScope}
          key={scope}
        />
      ))}
      <h3 className="text-xl font-extrabold">Expiry</h3>
      <Listbox value={lifetime} onChange={setLifetime}>
        <Listbox.Button>{lifetime.label}</Listbox.Button>
        <Listbox.Options>
          {lifetimeOptions.map((lt) => (
            <Listbox.Option
              key={lt.label}
              value={lt}
            >
              {lt.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>

      </Listbox>

      <div className="text-right">
        <button
          type="button"
          className="mx-3 px-2 py-1 text-lg font-bold text-gray-100 bg-blue hover:text-white rounded-md"
          onClick={submit}
        >
          Generate
        </button>
        <button
          type="button"
          className="mx-3 px-2 py-1 text-lg text-white bg-gray-400 hover:text-white rounded-md"
          onClick={closeDialog}
        >
          Cancel
        </button>
      </div>
    </Dialog.Panel>
  );
}
