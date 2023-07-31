import { signOut } from 'next-auth/react';
import React, { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    signOut({ callbackUrl: '/' });
  }, []);
  return (
    <div>
      <button
        className="px-3 py-2 bg-blue rounded-md text-white"
        type="button"
        onClick={() => signOut()}
      >
        Click here to sign out
      </button>
    </div>
  );
}
