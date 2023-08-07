import { ProfileWrapper } from './Context';
import Tokens from './Tokens';
import Key from './Key';
import User from './User';
import Admin from './admin/Admin';

function Profile() {
  return (
    <div className="flex">
      <div className="w-1/2">
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue"> Access </span>
          Tokens
        </h1>
        <Tokens />
      </div>
      <div className="w-1/2">
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue"> User </span>
          Info
        </h1>
        <User />
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue"> Crypto </span>
          Key
        </h1>
        <Key />
      </div>
    </div>
  );
}

export default function ProfileHelper() {
  return (
    <ProfileWrapper>
      <Profile />
      <Admin />
    </ProfileWrapper>
  );
}
