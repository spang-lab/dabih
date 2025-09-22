import Tokens from './Tokens';
import User from './User';
import PublicKeys from './PublicKeys';
import useSession from '@/Session';
import { Navigate } from 'react-router';
import FileData from './FileData';

export default function Profile() {
  const { user, isAdmin } = useSession();

  if (!user) {
    return (
      <Navigate to="/signin" />
    );
  }


  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
        <span className="text-blue">dabih </span>
        Settings
      </h1>
      <p className="text-gray-500">
        Configure dabih settings for your account, generate access token and find other users.
      </p>
      <h2 className="text-xl pt-5 font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        <span className="text-blue">Your </span>
        Account
      </h2>
      <p className="text-gray-500">
        This is the data dabih has about you.
      </p>
      <User />
      <h2 className="text-xl pt-5 font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        <span className="text-blue">Access </span>
        Tokens
      </h2>
      <p className="text-gray-500">
        API Token enable other tools to work with
        {' '}
        <span className="text-blue font-bold">dabih</span>
      </p>
      <Tokens />
      <h2 className="text-xl pt-5 font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        <span className="text-blue">Public </span>
        Keys
      </h2>
      <p className="text-gray-500">
        These users have keys registered with
        {' '}
        <span className="text-blue font-bold">dabih</span>
      </p>
      <p className="text-gray-500">
        The owners root keys are able to recover data.
      </p>
      <PublicKeys />
      <div hidden={!isAdmin}>
        <h2 className="text-xl pt-5 font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue">File </span>
          Data
        </h2>
        <p className="text-gray-500">
          This is the data stored in
          {' '}
          <span className="text-blue font-bold">dabih</span>
        </p>
        <FileData />
      </div>
    </div>
  );
}
