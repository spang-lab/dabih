import React from 'react';

import { useSession } from 'next-auth/react';
import PublicKeys from './PublicKeys';
import Datasets from './Datasets';
import Users from './Users';
import Session from './Session';
import Events from './Events';

export default function AdminInterface() {
  const { data: session } = useSession();
  if (!session || !session.user) {
    return null;
  }
  return (
    <div>
      <div className="flex flex-row">
        <div className="p-1">
          <Datasets />
        </div>
        <div className="p-1">
          <PublicKeys />
          <Users />
          <Session />
        </div>
      </div>
      <Events />
    </div>
  );
}
