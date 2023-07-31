import { signIn, useSession } from 'next-auth/react';
import UserMenu from './UserMenu';

export default function User() {
  const { data: session } = useSession();
  const user = session ? session.user : null;

  if (!user) {
    return (
      <button
        className="px-4 py-2 font-semibold rounded-full bg-blue text-gray-300 hover:text-white"
        onClick={() => signIn()}
        type="button"
      >
        Sign In
      </button>
    );
  }

  return <UserMenu user={user} />;
}
