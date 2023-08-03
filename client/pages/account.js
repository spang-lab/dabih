import React, { useState } from 'react';
import Image from 'next/image';

import { getCsrfToken, getProviders, signIn } from 'next-auth/react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]';

import { BigButton } from '../components';

function URProvider({ provider }) {
  const [user, setUser] = useState({ uid: '', password: '' });

  const setUid = (uid) => setUser({ ...user, uid });
  const setPassword = (password) => setUser({ ...user, password });

  const onSubmit = (e) => {
    e.preventDefault();
    signIn(provider.id, user);
  };
  return (
    <form method="post" onSubmit={onSubmit}>
      <label>
        Username
        <input name="uid" type="text" value={user.uid} onChange={(e) => setUid(e.target.value)} />
      </label>
      <label>
        Password
        <input name="password" type="password" value={user.password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Sign in</button>
    </form>
  );
}

function Provider({ provider }) {
  if (provider.id === 'ur') {
    return <URProvider provider={provider} />;
  }

  return (
    <div className="flex justify-center">
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
      <div>
        {Object.values(providers).map((p) => (
          <Provider key={p.id} provider={p} />
        ))}
        <pre className="border p-3 m-3">{JSON.stringify(providers, null, 2)}</pre>
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
    const { id, style } = provider;
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
