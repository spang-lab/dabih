import Tokens from './Tokens';
import User from './User';
import PublicKeys from './PublicKeys';
import { auth } from '@/lib/auth/auth';

export default async function Profile() {
  const session = await auth();
  if (!session) {
    return null;
  }
  const { user } = session;



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
      <User session={session} />
      <h2 className="text-xl pt-5 font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        <span className="text-blue">Access </span>
        Tokens
      </h2>
      <p className="text-gray-500">
        API Token enable other tools to work with
        {' '}
        <span className="text-blue font-bold">dabih</span>
      </p>
      <Tokens user={user} />
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
      <PublicKeys user={user} />
    </div>
  );
}
