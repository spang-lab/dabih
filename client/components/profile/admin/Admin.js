import { useUser } from '../../hooks';
import PublicKeys from './PublicKeys';
import Events from './Events';

export default function AdminInterface() {
  const user = useUser();

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        <span className="text-blue"> Admin </span>
        Controls
      </h1>
      <PublicKeys />
      <Events />

    </div>
  );
}
