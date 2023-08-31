'use client';

import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown } from 'react-feather';
import { useDatasets } from './Context';

export default function SortBy() {
  const { searchParams, setSearchParams } = useDatasets();
  const options = [
    {
      label: 'Upload Date', text: 'newest first', value: 'createdAt', direction: 'DESC',
    },
    {
      label: 'Upload Date', text: 'oldest first', value: 'createdAt', direction: 'ASC',
    },
    {
      label: 'Filename', text: 'A - Z', value: 'fileName', direction: 'ASC',
    },
    {
      label: 'Filename', text: 'Z - A', value: 'fileName', direction: 'DESC',
    },
    {
      label: 'Size', text: 'smallest first', value: 'size', direction: 'ASC',
    },
    {
      label: 'Size', text: 'largest first', value: 'size', direction: 'DESC',
    },
    {
      label: 'Uploaded by', text: 'A-Z', value: 'createdBy', direction: 'ASC',
    },
    {
      label: 'Uploaded by', text: 'Z-A', value: 'createdBy', direction: 'DESC',
    },
  ].map((o) => ({
    ...o,
    id: `${o.value}-${o.direction}`,
  }));

  const [selectedOption, setSelected] = useState(options[0]);

  const onSelect = (id) => {
    const option = options.find((o) => o.id === id);
    setSelected(option);
    setSearchParams({
      ...searchParams,
      page: 1,
      column: option.value,
      direction: option.direction,
    });
  };

  return (
    <div className="w-52">
      Sort by:
      <Listbox value={selectedOption.id} onChange={onSelect}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-md  py-2 pl-3 pr-10 text-left border text-sm">
            <span className="block truncate">
              {selectedOption.label}
              {' '}
              <span className="text-xs">

                (
                {selectedOption.text}
                )
              </span>

            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDown />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.id}
                  className={({ active }) => `relative cursor-default select-none py-2 pl-8 pr-1 ${active ? 'bg-blue text-white' : 'text-gray-900'
                  }`}
                  value={option.id}
                >
                  {({ selected }) => (
                    <>
                      <span
                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                        }`}
                      >
                        {option.label}
                        {' '}
                        <span className="text-xs">
                          (
                          {option.text}
                          )
                        </span>
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue">
                          <Check size={18} />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
