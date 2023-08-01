import { ProfileWrapper } from './Context';
import Tokens from './Tokens';
import Key from './Key';

function Profile() {
  return (
    <div className="flex">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue"> Access </span>
          Tokens
        </h1>
        <Tokens />
      </div>
      <div>
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
    </ProfileWrapper>
  );
}
