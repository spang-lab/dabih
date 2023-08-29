import React, { useState } from 'react';
import Image from 'next/image';

import { getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

function URProvider({ provider }) {
  const [user, setUser] = useState({ uid: '', password: '' });

  const setUid = (uid) => setUser({ ...user, uid });
  const setPassword = (password) => setUser({ ...user, password });

  const onSubmit = (e) => {
    e.preventDefault();
    signIn(provider.id, user);
  };
  return (
    <div className="flex justify-center">
      <div className="border-b pb-4 mb-4 ">
        <form method="post" onSubmit={onSubmit}>
          <div className="w-full">
            <label htmlFor="uid">
              <p className="font-extrabold m-1 text-xl">
                RZ Account
              </p>
              <input
                className="border w-full rounded-md px-2 py-1 my-1"
                name="uid"
                id="uid"
                type="text"
                placeholder="abc12345"
                value={user.uid}
                onChange={(e) => setUid(e.target.value)}
              />
            </label>
          </div>
          <div className="w-full">
            <label htmlFor="password">
              <p className="font-extrabold m-1 text-xl">
                Password
              </p>
              <input
                className="border w-full rounded-md px-4 py-1 my-1"
                name="password"
                type="password"
                value={user.password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>
          <button
            className="px-3 py-2 mt-4 inline-flex items-center text-lg font-semibold bg-blue text-white rounded-md"
            type="submit"
          >
            <Image
              width={32}
              height={32}
              className="mx-2"
              src={provider.style.logo}
              alt="Provider logo"
            />
            Sign in with
            {' '}
            {provider.name}
          </button>
        </form>
      </div>
    </div>
  );
}

function Provider({ provider }) {
  if (provider.id === 'ur') {
    return <URProvider provider={provider} />;
  }

  return (
    <div className="flex justify-center ">
      <button
        type="button"
        className="px-3 py-2 inline-flex items-center text-lg font-semibold bg-blue text-white rounded-md"
        onClick={() => signIn(provider.id)}
      >
        <Image
          width={32}
          height={32}
          className="mx-2"
          src={provider.style.logo}
          alt="Provider logo"
        />
        Sign in with
        {' '}
        {provider.name}
      </button>
    </div>

  );
}

export default function Account({ providers }) {
  return (
    <div>
      <h1 className="text-4xl pb-4 font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Sign in to
        {' '}
        <span className="text-blue">your account</span>
      </h1>
      <div className="text-base text-gray-400 sm:text-lg md:text-xl">
        <span className="font-semibold text-blue"> Dabih </span>
        {' '}
        needs two
        factors from you to work:
        <ul className="px-4 leading-relaxed list-disc">
          <li>You need to be registered at your identiy provider</li>
          <li>
            You need to have your
            {' '}
            <span className="font-semibold text-blue"> Private Key </span>
          </li>
          <li>
            We do
            {' '}
            <span className="font-semibold text-blue"> not </span>
            {' '}
            store
            your personal data.
          </li>
          <li>
            The identiy provider gives
            {' '}
            <span className="font-semibold text-blue"> Dabih </span>
            {' '}
            a
            personalized access token.
          </li>
          <li>
            The access token will be used to verify you are authorized to use
            this service.
          </li>
        </ul>
      </div>
      <div className="flex flex-col items-stretch my-10">
        {Object.values(providers).map((p) => (
          <Provider key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    return { redirect: { destination: '/key' } };
  }

  const providers = await getProviders() ?? [];

  authOptions.providers.forEach((provider) => {
    const id = provider.options.id || provider.id;
    const style = provider.style || provider.options.style;
    if (providers[id]) {
      providers[id].style = style;
    }
  });

  return {
    props: {
      providers,
    },
  };
}
