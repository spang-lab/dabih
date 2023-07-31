import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Key,
  ChevronDown,
  LogOut,
  Settings,
  XCircle,
  PlusCircle,
} from 'react-feather';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { storage } from '../../lib';

function KeyStatus() {
  const router = useRouter();
  const key = storage.useKey();

  if (key) {
    return (
      <div className="border-b py-3">
        <div className="inline-flex py-1 text-green font-semibold">
          <Key size={18} className="mr-3" />
          Key loaded
        </div>
        <MenuItem onClick={() => storage.deleteKey()}>
          <XCircle size={18} className="ml-5 mr-3" />
          <span className="text-sm">Unload key</span>
        </MenuItem>
      </div>
    );
  }

  return (
    <div className="border-b py-3">
      <div className="inline-flex py-1 text-gray-800 font-semibold">
        No key loaded
      </div>
      <MenuItem onClick={() => router.push('/key')}>
        <PlusCircle size={18} className="ml-5 mr-3" />
        <span className="text-sm">Load key</span>
      </MenuItem>
    </div>
  );
}

function MenuItem({ children, onClick }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          type="button"
          className={`${
            active ? 'bg-purple text-white' : 'text-blue'
          } group font-semibold inline-flex w-full items-center rounded-md px-2 py-2 text-sm`}
        >
          {children}
        </button>
      )}
    </Menu.Item>
  );
}

export default function UserMenu({ user }) {
  const router = useRouter();
  return (
    <Menu as="div" className="relative inline-block text-center">
      <div>
        <Menu.Button className="inline-flex text-gray-300 bg-blue px-3 py-2 rounded-md font-semibold">
          {user.name}
          <ChevronDown className="my-1" size={18} />
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
        <Menu.Items className="absolute z-10 right-0 mt-2 w-40 origin-top-right rounded-md bg-gray-50 shadow-lg focus:outline-none">
          <KeyStatus />
          <MenuItem onClick={() => router.push('/profile')}>
            <Settings size={18} className="mr-3" />
            Preferences
          </MenuItem>
          <div className="border-t">
            <MenuItem onClick={() => signOut()}>
              <LogOut size={18} className="mr-3" />
              Sign Out
            </MenuItem>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
