import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Clock } from 'react-feather';
import LoadKey from '../load_key/LoadKey';
import CreateKey from '../create_key/CreateKey';
import { Spinner, useUsers } from '../util';
import { AdminContact } from '../branding';

export default function Key() {
  const { data: session } = useSession();
  const users = useUsers();
  const [state, setState] = useState('loading');

  useEffect(() => {
    if (!session || !session.user || !users) {
      return;
    }
    const { sub } = session.user;
    const user = users.find((u) => u.sub === sub);
    if (!user) {
      setState('no_key');
      return;
    }
    if (user.confirmed) {
      setState('has_key');
      return;
    }
    setState('unconfirmed_key');
  }, [session, users]);

  if (state === 'loading') {
    return (
      <div className="flex justify-center mt-10">
        <Spinner />
      </div>
    );
  }

  if (state === 'unconfirmed_key') {
    return (
      <div className="py-10 text-center">
        <Clock className="inline-block m-2 text-blue" size={80} />
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Please
          <span className="text-blue"> wait for an admin </span>
          to confirm your key
        </h2>
        <div className="text-base text-gray-400 sm:text-lg md:text-xl">
          In order to prevent misuse each new key must be
          <span className="text-blue"> unlocked </span>
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
      {state}
      <LoadKey isVisible={state === 'has_key'} />
      <CreateKey isOpen={state === 'no_key'} />
    </div>
  );
}
