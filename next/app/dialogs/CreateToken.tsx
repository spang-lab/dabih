'use client';

import { Dialog, Listbox } from '@headlessui/react';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';
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
  const match = /^(\d+)([hdwmy])$/.exec(timeStr);
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
const lifetimeOptions = [
  { label: 'never', value: null },
  { label: 'one hour', value: timeToSeconds('1h') },
  { label: 'one day', value: timeToSeconds('1d') },
  { label: 'one week', value: timeToSeconds('1w') },
  { label: 'one month', value: timeToSeconds('1m') },
  { label: 'six months', value: timeToSeconds('6m') },
  { label: 'one year', value: timeToSeconds('1y') },
];

export default function CreateToken({ ctx, closeDialog }) {
  const { onSubmit } = ctx;
  const { user, status } = useSession();

  const uScopes = user?.scopes || [];
  const [scopes, setScopes] = useState<any>(uScopes.reduce((acc, scope) => {
    acc[scope] = true;
    return acc;
  }, {}));
  const [lifetime, setLifetime] = useState<any>(lifetimeOptions[0]);

  const submit = () => {
    if (onSubmit) {
      const scopeList = Object.keys(scopes).filter((s) => scopes[s]);
      onSubmit(scopeList, lifetime.value);
    }
    closeDialog();
  };

  const setScope = (scope: string, value: boolean) => {
    const newScopes = {
      ...scopes,
    };
    newScopes[scope] = value;
    setScopes(newScopes);
  };
  const setUpload = () => {
    const newScopes = Object.keys(scopes).reduce((acc, scope) => {
      acc[scope] = scope === 'upload';
      return acc;
    }, {});
    setScopes(newScopes);
  };

  if (status !== 'authenticated') {
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
      <h3 className="text-xl py-2 font-extrabold">Token Expiry</h3>
      <div className="h-72">
        <Listbox value={lifetime} onChange={setLifetime}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left border  focus:outline-none sm:text-sm">
              <span className="block truncate">{lifetime.label}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDown />
              </span>
            </Listbox.Button>
            <Listbox.Options className="mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base border sm:text-sm">
              {lifetimeOptions.map((lt) => (
                <Listbox.Option
                  key={lt.value}
                  value={lt}
                  className={({ active }) => `relative cursor-default select-none py-2 pl-10 ${active ? 'bg-blue text-white' : 'text-gray-800'}`}
                >
                  <span
                    className="block truncate"

                  >
                    {lt.label}
                  </span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>
        <h3 className="text-xl py-2 font-extrabold">Help</h3>
        <p>
          Scopes are permissions for the dabih API.
        </p>
        <p className="pb-4">
          See the
          <a target="_blank" className="text-blue hover:underline font-semibold mx-1" href="/docs/api">API Documentation</a>
          for help on scopes.
        </p>
        <p>
          If you only active the
          {' '}
          <span className="font-mono">upload</span>
          {' '}
          scope the token may be shared with others, and they can upload data into your account.
        </p>

        <button
          type="button"
          className="px-2 py-1 text-sm text-gray-100 bg-blue hover:text-white rounded-md"
          onClick={setUpload}
        >
          Set upload scope
        </button>
      </div>

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
