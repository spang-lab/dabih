import React from 'react';
import { useSession } from 'next-auth/react';
import { Clock } from 'react-feather';
import LoadKey from '../load_key/LoadKey';
import CreateKey from '../create_key/CreateKey';
import { useUsers } from '../util';
import { AdminContact } from '../branding';

export default function Key() {
  const { data: session } = useSession();
  const users = useUsers();

  if (!session || !session.user) {
    return null;
  }

  const getUserState = () => {
    const { sub } = session.user;
    if (!users.length) {
      return null;
    }
    const user = users.find((u) => u.sub === sub);
    if (!user) {
      return 'no_key';
    }
    if (user.confirmed) {
      return 'has_key';
    }
    return 'unconfirmed_key';
  };
  const state = getUserState();

  if (state === 'unconfirmed_key') {
    return (
      <div className="py-10 text-center">
        <Clock className="inline-block m-2 text-sky-700" size={80} />
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Please
          <span className="text-sky-700"> wait for an admin </span>
          to confirm your key
        </h2>
        <div className="text-base text-gray-500 sm:text-lg md:text-xl">
          In order to prevent misuse each new key must be
          <span className="text-sky-700"> unlocked </span>
          by a dabih admin.
          <br />
          For now please contact the admin via email:
        </div>
        <AdminContact />
      </div>
    );
  }

  return (
    <div>
      <LoadKey isVisible={state === 'has_key'} />
      <CreateKey isOpen={state === 'no_key'} />
    </div>
  );
}
