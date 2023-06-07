import React from 'react';

import { useSession } from 'next-auth/react';
import { Link, LocalDate, Title3 } from '../util';

function DebugSession() {
  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  return (
    <div>
      <Title3>Session</Title3>
      Expires
      <LocalDate value={session.expires} />
      <Link href="/logout">Drop NextAuth Session</Link>
      <p className="font-bold">Session:</p>
      <pre className="max-w-md p-1 m-1 text-sm bg-gray-100 border border-gray-300 rounded-lg">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
export default DebugSession;
