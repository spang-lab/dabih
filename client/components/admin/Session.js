import React from 'react';

import { useSession } from 'next-auth/react';
import { Link, LocalDate } from '../util';

function DebugSession() {
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  return (
    <div>
      <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        Session
      </h3>
      Expires
      <LocalDate value={session.expires} />
      <Link href="/logout">Drop NextAuth Session</Link>
      <p className="font-bold">Session:</p>
      <pre className="max-w-md p-1 m-1 text-sm bg-gray-light border border-gray-mid rounded-lg">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
export default DebugSession;
