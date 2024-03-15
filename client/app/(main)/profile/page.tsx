'use client';

import { ProfileWrapper } from './Context';
import Tokens from './Tokens';
import Key from './Key';
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
      <p className="text-gray-600 text-lg">
        Configure dabih settings for your account, generate access token and find other users.
      </p>
      <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        <span className="text-blue">Your </span>
        Account
      </h2>
      <User />

      <div className="flex">
        <div className="w-1/2">
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
            <span className="text-blue"> Access </span>
            Tokens
          </h1>
          <Tokens />
        </div>
        <div className="w-1/2">
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
            <span className="text-blue"> User </span>
            Info
          </h1>
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
            <span className="text-blue"> Crypto </span>
            Key
          </h1>
        </div>
      </div>
      <div>
        <RootKeys />
      </div>
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
