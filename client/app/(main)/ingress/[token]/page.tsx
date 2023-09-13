'use client';

import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Copy } from 'react-feather';
import { Upload as Uploader, useApi } from '@/components';
import {
  MacAppDownload, WindowsDownload, MacDmgDownload, LinuxAppDownload, LinuxDebDownload,
} from './DownloadLink';

export default function Upload() {
  const [user, setUser] = useState({ name: '' });
  const [agreed, setAgree] = useState(false);
  const toggle = () => setAgree(!agreed);
  const searchParams = useSearchParams();

  const [url, setUrl] = useState('');
  const copyUrl = () => {
    navigator.clipboard.writeText(url);
  };

  const api = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await api.getUser();
      setUser(u);
    };
    fetchUser();
  }, [api]);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const getName = () => {
    const name = searchParams?.get('name');
    if (!name) {
      return null;
    }
    return (
      <span>
        with the label
        <span className="px-2 m-2 border-2 border-blue text-blue rounded-md font-mono">{name}</span>
      </span>
    );
  };

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
      <h2 className="py-2 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
        Use the
        {' '}
        <span className="text-blue">dabih uploader app</span>
      </h2>
      <p className="text-lg">
        You can download an app from us to upload files to dabih.
        Advantages of using the app:
      </p>
      <ul className="list-disc list-inside text-lg">
        <li>You can upload and queue up many files.</li>
        <li>Large Files can be uploaded in the background</li>
      </ul>
      <p className="text-lg">
        Start the app and paste the URL of this page into the URL Field.
      </p>
      <div className="flex bg-gray-200 items-center rounded-md py-2 px-3">
        <div className="font-mono text-lg">{url}</div>
        <div className="pl-1">
          <button
            type="button"
            className="text-gray-100 ml-5 bg-gray-600 rounded-md px-2 py-1 inline-flex"
            onClick={copyUrl}
          >
            <Copy size={24} />
            <span className="px-1">Copy</span>
          </button>
        </div>
      </div>
      <p className="text-lg">
        Then select the data you want to upload.
      </p>

      <h3 className="text-2xl font-bold py-2">
        Downloads
      </h3>
      <div className="flex h-52 justify-stretch items-stretch my-4">
        <div className="border flex flex-col m-2 p-2 rounded-md w-1/3">
          <div className="w-20 h-20 relative mx-auto m-2">
            <Image
              alt="macOS Logo"
              src="/images/logo/macOS.svg"
              sizes="99vw"
              className="object-contain"
              fill
            />
          </div>
          <div className="flex justify-center py-1">
            <MacDmgDownload />
          </div>
          <div className="flex justify-center py-1">
            <MacAppDownload />
          </div>

        </div>
        <div className="border m-2 p-2 rounded-md w-1/3">
          <div className="w-20 h-20 relative mx-auto m-2">
            <Image
              src="/images/logo/windows.svg"
              alt="Windows Logo"
              sizes="99vw"
              className="object-contain"
              fill
            />
          </div>
          <div className="flex justify-center py-1">
            <WindowsDownload />
          </div>
        </div>
        <div className="border flex flex-col m-2 p-2 rounded-md w-1/3">
          <div className="w-20 h-20 relative mx-auto m-2">
            <Image
              alt="Linux Logo"
              src="/images/logo/linux.png"
              sizes="99vw"
              className="object-contain"
              fill
            />
          </div>
          <div className="flex justify-center py-1">
            <LinuxAppDownload />
          </div>
          <div className="flex justify-center py-1">
            <LinuxDebDownload />
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
        Upload directly to
        {' '}
        <span className="text-blue">dabih</span>
      </h2>
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
        {getName()}
      </p>
      <Uploader disabled={!agreed} />
    </div>
  );
}
