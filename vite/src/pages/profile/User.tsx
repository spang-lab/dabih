import {
  User, Key
} from 'react-feather';
import { LocalDate } from '@/util';

import LocalKey from './LocalKey';
import useSession from '@/Session';
import crypto from '@/lib/crypto';



export default function Account() {
  const { user, isAdmin, token } = useSession();
  if (!user) {
    return null;
  }
  let exp = null;
  if (token) {
    const payload = crypto.jwt.decode(token);
    if (payload && payload.exp) {
      exp = payload.exp * 1000; // Convert to milliseconds
    }
  }

  const {
    sub, email, scope,
  } = user;
  const scopes = scope.split(' ');

  return (
    <div>
      <div className="border rounded-xl border-gray-400 m-2 p-2 flex flex-row flex-wrap items-center justify-between">
        <div className="inline-flex items-center text-blue font-extrabold text-xl">
          <User className="text-blue mx-3" size={34} />
          Account
        </div>
        <div>
          <a className="text-blue px-2 font-bold" href={`mailto:${email}`}>
            {email}
          </a>
          <span className="text-gray-500 px-3">
            (id:
            {' '}
            {sub}
            )
          </span>
        </div>
        <div className="px-2 bg-blue rounded-full py-1 text-white font-extrabold mx-2">
          {(isAdmin) ? 'Admin' : 'User'}
        </div>
        <div className="text-sm px-2">
          <p className="text-gray-500">
            Session expires:
          </p>
          <LocalDate value={exp} showTime />
        </div>
        <div>
          Scopes:
          {scopes.map((s) => (
            <span
              key={s}
              className="border text-sm font-mono rounded-full px-2 py-1 mx-1 border-gray-200"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="border rounded-xl border-gray-400 m-2 p-2 flex flex-row flex-wrap items-center">
        <div className="inline-flex items-center text-blue font-extrabold text-xl">
          <Key className="text-blue mx-3" size={34} />
          RSA Private Key
        </div>
        <LocalKey />
      </div>
    </div>
  );
}
