import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  ChevronDown, Trash2, AlertOctagon, RotateCcw,
} from 'react-feather';

function Action({
  children, enabled, className, onClick,
}) {
  const getClass = (active) => {
    if (!enabled) {
      return 'text-gray-mid';
    }
    if (active) {
      return 'bg-main-mid text-white';
    }
    return className;
  };

  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          type="button"
          className={`${getClass(active)} 
          group flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export default function Actions({ data, onAction }) {
  const { deleted, mnemonic } = data;

  return (
    <div className="text-right ">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="z-0 inline-flex justify-center w-full p-2 text-sm font-extrabold text-white border rounded bg-main-mid focus-visible:ring-white focus-visible:ring-opacity-75">
            Actions
            <ChevronDown className="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 w-32 mt-2 bg-white shadow-lg origin-top-right divide-y divide-gray-light rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Action
                onClick={() => onAction('delete', mnemonic)}
                className="text-danger"
                enabled={!deleted}
              >
                <Trash2 className="mx-2" size={24} />
                Delete
              </Action>
              <Action
                onClick={() => onAction('recover', mnemonic)}
                className="text-main-mid"
                enabled={!!deleted}
              >
                <RotateCcw className="mx-2" size={24} />
                Recover
              </Action>
              <div className="pt-2 mt-2 border-t">
                <span className="text-xs font-extrabold text-center">
                  Irreversible
                </span>
                <Action
                  onClick={() => onAction('destroy', mnemonic)}
                  className="text-danger"
                  enabled={!!deleted}
                >
                  <AlertOctagon className="mx-2 font-extrabold" size={24} />
                  Destroy
                </Action>
              </div>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
