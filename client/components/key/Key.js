import React from 'react';
import { useSession } from 'next-auth/react';
import { Clock } from 'react-feather';
import LoadKey from '../load_key/LoadKey';
import CreateKey from '../create_key/CreateKey';
import {
  Color, Subtitle1, Title2, useUsers, AdminContact,
} from '../util';

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
    const user = users.find(((u) => u.sub === sub));
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
        <Title2>
          Please
          <Color>wait for an admin</Color>
          to confirm your key
        </Title2>
        <Subtitle1>
          In order to prevent misuse each new key must be
          <Color>unlocked</Color>
          by a dabih admin.
          <br />
          For now please contact the admin via email:
        </Subtitle1>
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
