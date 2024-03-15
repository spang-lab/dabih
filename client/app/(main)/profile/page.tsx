'use client';

import { ProfileWrapper } from './Context';
import Tokens from './Tokens';
import User from './User';
import RootKeys from './RootKeys';
import Admin from './admin/Admin';

function Profile() {
  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
        <span className="text-blue">dabih </span>
        Settings
      </h1>
      <p className="text-gray-500">
        Configure dabih settings for your account, generate access token and find other users.
      </p>
      <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        <span className="text-blue">Your </span>
        Account
      </h2>
      <p className="text-gray-500">
        This is the data dabih has about you.
      </p>
      <User />
      <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        <span className="text-blue">Access </span>
        Tokens
      </h2>
      <p className="text-gray-500">
        API Token enable other tools to work with
        {' '}
        <span className="text-blue font-bold">dabih</span>
      </p>
      <Tokens />
      <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        <span className="text-blue">Root </span>
        Keys
      </h2>
      <p className="text-gray-500">
        The owners of these keys are able to recover data.
      </p>
      <RootKeys />
    </div>
  );
}

export default function ProfileHelper() {
  return (
    <ProfileWrapper>
      <Profile />
      <Admin />
    </ProfileWrapper>
  );
}
