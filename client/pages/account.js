import React, {useState} from 'react';
import Image from 'next/image';

import {getProviders, signIn} from 'next-auth/react';
import {getServerSession} from 'next-auth/next';
import authOptions from '@/app/api/auth/options';
import {Provider} from '@/components';

export default function Account({providers}) {
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
      <div className="flex flex-col max-w-md mx-auto my-10">
        {Object.values(providers).map((p) => (
          <Provider key={p.id} provider={p} />
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const {req, res} = context;
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    return {redirect: {destination: '/key'}};
  }

  const providers = await getProviders() ?? [];

  return {
    props: {
      providers,
    },
  };
}
