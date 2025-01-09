
import { DialogTitle, DialogPanel, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/react';
import { useState } from 'react';
import { ChevronDown } from 'react-feather';
import { Switch } from '../util';
import { DialogTransition } from './Transition';

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

function Scope({ scope, value, onChange }:
  { scope: string, value: boolean, onChange: (scope: string, value: boolean) => void }) {
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

export default function CreateTokenDialog({ show, scopes, onClose, onSubmit }:
  {
    show: boolean,
    scopes: string[],
    onClose: () => void,
    onSubmit: ({ scopes, lifetime }: { scopes: string[]; lifetime: number | null }) => void
  }
) {

  const [tokenScopes, setScopes] = useState<Record<string, boolean>>(scopes.reduce((acc, scope) => {
    acc[scope] = true;
    return acc;
  }, {}));
  const [lifetime, setLifetime] = useState<{ label: string, value: number | null }>(lifetimeOptions[0]);

  const submit = () => {
    const scopeList = Object.keys(tokenScopes).filter((s) => tokenScopes[s]);
    onSubmit({
      scopes: scopeList,
      lifetime: lifetime.value,
    });
    onClose();
  };

  const setScope = (scope: string, value: boolean) => {
    const newScopes = {
      ...tokenScopes,
    };
    newScopes[scope] = value;
    setScopes(newScopes);
  };

  return (
    <DialogTransition show={show} onClose={onClose}>
      <DialogPanel className="w-full max-w-lg p-6 overflow-hidden text-left align-middle shadow-xl transform rounded-2xl transition-all border bg-gray-50 border-gray-300">
        <DialogTitle
          as="h2"
          className="pb-3 text-2xl font-extrabold text-gray-800 leading-6"
        >
          New Access Token
        </DialogTitle>
        <p className="pb-3">
          This token can be used by command line tools to perform
          actions in
          {' '}
          <span className="text-blue font-bold">dabih</span>
        </p>
        <h3 className="text-xl font-extrabold">Configure Scopes</h3>

        {Object.keys(tokenScopes).map((scope) => (
          <Scope
            scope={scope}
            value={tokenScopes[scope]}
            onChange={setScope}
            key={scope}
          />
        ))}
        <h3 className="text-xl py-2 font-extrabold">Token Expiry</h3>
        <div className="h-72">
          <Listbox value={lifetime} onChange={setLifetime}>
            <div className="relative mt-1">
              <ListboxButton className="relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left border  focus:outline-none sm:text-sm">
                <span className="block truncate">{lifetime.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDown />
                </span>
              </ListboxButton>
              <ListboxOptions className="mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base border sm:text-sm">
                {lifetimeOptions.map((lt) => (
                  <ListboxOption
                    key={lt.value}
                    value={lt}
                    className="relative cursor-default select-none py-2 pl-10 text-gray-800 data-[focus]:bg-blue data-[focus]:text-white"
                  >
                    <span
                      className="block truncate"
                    >
                      {lt.label}
                    </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
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
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </DialogPanel>
    </DialogTransition>
  );
}
