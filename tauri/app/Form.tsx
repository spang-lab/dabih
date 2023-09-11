'use client';

import { useState } from 'react';
import { X } from 'react-feather';
import useApi from './Api';

export default function Form() {
  const {
    setUrl, user, auth, isReady,
  } = useApi();
  const [value, setValue] = useState('');

  const onChange = async (e) => {
    const url = e.target.value;
    setValue(url);
    setUrl(url);
  };

  if (isReady) {
    const { name, email } = user;
    const { baseUrl, token } = auth;
    return (
      <div className="bg-green/30 rounded-md p-2">
        <h2 className="text-2xl font-extrabold text-green">
          Ready for upload
        </h2>
        <div className="rounded-md p-2 flex flex-row items-center justify-between">
          <div className="text-lg text-gray-400 pl-4 font-extrabold">
            <p className="text-white">
              {name}
              &lt;
              <a className="text-blue" href={`mailto:${email}`}>
                {email}
              </a>
              &gt;
            </p>
            <p>
              Dabih url:
              {' '}
              <span className="text-blue">{baseUrl}</span>
            </p>
            <p>
              Token:
              {' '}
              <span className="font-mono">
                {token}
              </span>
            </p>
          </div>
          <div className="text-center">
            <button
              className="flex flex-col items-center bg-gray-800/50 p-2 rounded-md"
              type="button"
              onClick={() => {
                setValue('');
                setUrl(null);
              }}
            >
              <X size={30} />
              <span className="text-xs">
                Go Back
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getMessage = () => {
    if (!user) {
      return null;
    }
    if (user.error) {
      return (
        <div className="bg-red/30 my-2 rounded-md p-2">
          <h3 className="text-lg text-red pl-4 font-extrabold">
            Invalid Url
          </h3>
          <p className="text-gray-200">
            The url should be of the form:
          </p>
          <p className="font-mono text-center text-gray-400">
            https://&lt;dabih-url&gt;/ingress/&lt;token&gt;
          </p>
          <p className="text-xs font-thin pt-1">
            {user.error}
          </p>
        </div>
      );
    }
    const { name, email } = user;
    return (
      <div className="bg-green/30 my-2 rounded-md p-2 flex flex-row items-center justify-between">
        <div className="text-lg text-green pl-4 font-extrabold">
          Data will be sent to
          {' '}
          <span className="text-white">
            {name}
            &lt;
            {email}
            &gt;
          </span>
        </div>
        <div>
          <button
            className=""
            type="button"
            onClick={() => {
              setValue('');
              setUrl(null);
            }}
          >
            <X size={30} />
          </button>
        </div>
      </div>
    );
  };
  const disabled = user && !user.error;

  return (
    <div className="max-w-2xl mx-auto ">
      <h2 className="font-bold text-2xl py-2">
        Set the Upload Url:
      </h2>
      <input
        disabled={disabled}
        type="text"
        className="text-black w-full rounded-md p-1 disabled:bg-gray-400 disabled:font-bold"
        placeholder="dabih upload url"
        value={value}
        onChange={onChange}
      />
      <div>
        {getMessage()}
      </div>
    </div>
  );
}
