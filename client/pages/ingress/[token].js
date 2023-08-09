import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

import Link from 'next/link';
import { Upload as Uploader, useApi } from '../../components';

export default function Upload() {
  const [user, setUser] = useState({});
  const [agreed, setAgree] = useState(false);
  const toggle = () => setAgree(!agreed);

  const api = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await api.getUser();
      setUser(u);
    };
    if (api.isReady()) {
      fetchUser();
    }
  }, [api]);

  return (
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Data
        {' '}
        <span className="text-blue">ingress</span>
      </h1>
      <div className="text-base text-gray-400 sm:text-lg md:text-xl">
        This page is used to send data to someone else, you
        {' '}
        <span className="font-bold">do not need</span>
        {' '}
        and account or a crypo
        key yourself.
      </div>

      <div className="flex flex-row items-center py-3">
        <Switch
          checked={agreed}
          onChange={toggle}
          className={`${agreed ? 'bg-blue' : 'bg-gray-400'}
    relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
        >
          <span className="sr-only">Key enabled</span>
          <span
            aria-hidden="true"
            className={`${agreed ? 'translate-x-6' : 'translate-x-0'}
      pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
          />
        </Switch>
        <div className="pl-3">
          I agreed to share my data with
          <span className="font-semibold text-blue">
            {' '}
            {user.name}
            {' '}
          </span>
          and i have read and agree to the
          {' '}
          <Link
            className="text-blue hover:underline"
            target="_blank"
            href="/data_policy"
          >
            Data Policy
          </Link>
        </div>
      </div>

      <p className="pt-5 text-3xl text-center">
        <span className="font-bold">Note: </span>
        Uploaded data will be sent to
        <span className="font-semibold text-blue">
          {' '}
          {user.name}
          {' '}
        </span>
      </p>
      <Uploader disabled={!agreed} />
    </div>
  );
}
