import { ProfileWrapper, useProfile } from './Context';

function Profile() {
  const { tokens } = useProfile();
  return <pre>{JSON.stringify(tokens, null, 2)}</pre>;
}

export default function ProfileHelper() {
  return (
    <ProfileWrapper>
      <Profile />
    </ProfileWrapper>
  );
}
