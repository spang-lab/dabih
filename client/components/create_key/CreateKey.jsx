import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronRight } from 'react-feather';

import { Title2, Color, Danger } from '../util';

import GenerateKey from './GenerateKey';
import AddPublicKey from './AddPublicKey';

function Card({ children }) {
  return (
    <div className="flex items-stretch justify-center w-full border-2 rounded-xl h-80 bg-sky-50 border-sky-800 sm:h-64">
      {children}
    </div>
  );
}

export default function CreateKey({ isOpen }) {
  const getNote = () => {
    if (isOpen) {
      return null;
    }
    return (
      <span className="text-lg">
        <Danger>Warning:</Danger>
        You already have a key registered,
        any new key you registered will not automatically gain access to existing data.
      </span>
    );
  };

  return (
    <div className="w-full">
      <Disclosure defaultOpen={isOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full py-2 text-lg font-bold text-black">
              <ChevronRight
                size={40}
                className={`${
                  open ? 'rotate-90 transform' : ''}`}
              />
              <Title2>
                Add a
                <Color>new</Color>
                keypair
              </Title2>
            </Disclosure.Button>
            <Disclosure.Panel>
              <div className="px-4 sm:px-6 lg:px-8">
                {getNote()}
                <div className="max-w-2xl mx-auto lg:max-w-none">
                  <div className="mt-6 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-6">
                    <Card>
                      <GenerateKey />
                    </Card>
                    <Card>
                      <AddPublicKey />
                    </Card>
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
