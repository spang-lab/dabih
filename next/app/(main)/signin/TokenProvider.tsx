"use client";
import { ChevronRight, Cpu } from 'react-feather';
import { Provider } from '@/lib/auth/auth';
import { signIn } from 'next-auth/react';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { useSearchParams } from 'next/navigation';


export default function TokenProvider({ provider }: { provider: Provider }) {
  const searchParams = useSearchParams();
  const message = searchParams.get('code');
  return (
    <div>
      <p className='text-red'>
        {message}
      </p>
      <Disclosure>
        <DisclosureButton className="group flex items-center gap-2 text-gray-500">
          <ChevronRight className="group-data-[open]:rotate-90" />
          Use an access token
        </DisclosureButton>
        <DisclosurePanel className="flex">
          <div className="pb-4 mb-4 ">
            <form action={async (formData) => {
              try {
                const token = formData.get('token');
                await signIn(provider.id, {
                  token,
                  redirectTo: '/key',
                })
              } catch (error) {
                console.error(error);
              }
            }
            }>
              <input
                className="border w-[500px] rounded-md px-4 py-1 my-1 text-xs"
                name="token"
                type="text"
              />
              <button
                className="px-2 py-1 text-sm  inline-flex items-center bg-blue text-white rounded-md"
                type="submit"
              >
                <Cpu size={24} className="pr-3" />
                Sign in with Token
              </button>
            </form>
          </div>

        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
