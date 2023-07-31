import { signIn, useSession } from 'next-auth/react';
import { User } from 'react-feather';
import { Link } from '../util';

export default function UserItem() {
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
  return (
    <Link href="/profile">
      <div className="relative flex flex-col items-center text-gray-200 border-blue">
        <div className="flex items-center justify-center w-10 h-10 py-3 border-2 rounded-full border-gray-200">
          <User />
        </div>
        <div className="pt-2 text-xs font-medium text-center uppercase">
          Settings
        </div>
      </div>
    </Link>
  );
}
