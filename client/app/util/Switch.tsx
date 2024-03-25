'use client';

import { Switch } from '@headlessui/react';

type ChangeHandler = (checked: boolean) => void;

export default function ToggleSwitch({ enabled, onChange }:
{ enabled: boolean, onChange: ChangeHandler }) {
  return (
    <Switch
      checked={enabled}
      onChange={onChange}
      className={`${enabled ? 'bg-blue' : 'bg-gray-400'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
    >
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  );
}
