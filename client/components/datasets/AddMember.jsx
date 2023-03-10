import React, { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import {
  ChevronsDown, UserPlus, User,
} from 'react-feather';
import { SmallButton, Highlight } from '../util';
import { useDatasets } from './Context';

function MemberOption({ option }) {
  return (
    <Combobox.Option
      className={({ active }) => `relative cursor-default select-none py-2 px-4 ${
        active ? 'bg-sky-600 text-white' : 'text-gray-900'
      }`}
      value={option}
    >
      <span className="text-gray-700">
        <User className="inline-block" size={14} />
        <span className="px-1">User</span>
        <Highlight>{option.sub}</Highlight>
        {option.name}
      </span>
    </Combobox.Option>
  );
}

export default function AddMember({ dataset, options }) {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');

  const { addMembers } = useDatasets();
  const { mnemonic, permission } = dataset;

  const onAdd = async () => {
    addMembers(mnemonic, [selected.sub]);

    setQuery('');
    setSelected(null);
  };

  if (permission !== 'write') {
    return (
      <div className="text-sm text-center text-gray-400">
        Users with write permission can add members
      </div>
    );
  }

  const filtered = query === ''
    ? options
    : options.filter((opt) => opt.name
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase().replace(/\s+/g, '')));

  const getDisplayValue = (opt) => {
    if (!opt) {
      return '';
    }
    return `${opt.sub} ${opt.name}`;
  };

  return (
    <div className="flex flex-row items-center justify-center">
      <div className="px-3 text-gray-500 whitespace-nowrap">
        Add members:
      </div>
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative p-1 grow">
          <div className="relative w-full overflow-hidden text-left bg-white border border-gray-400 rounded-lg cursor-default sm:text-sm">
            <Combobox.Input
              className="w-full py-2 pl-3 pr-10 text-sm text-gray-900 border-none leading-5"
              displayValue={getDisplayValue}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsDown
                size={24}
                className="text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base bg-white max-h-60 rounded-md ring-1 ring-black ring-opacity-5 sm:text-sm">
              {filtered.length === 0 && query !== '' ? (
                <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                  No users found.
                </div>
              ) : (
                filtered.map((u) => <MemberOption key={u.sub || u.name} option={u} />)
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
      <div className="px-3">
        <SmallButton className="whitespace-nowrap" onClick={onAdd}>
          <UserPlus className="inline-block mr-2" size={18} />
          Add
        </SmallButton>
      </div>
    </div>
  );
}
