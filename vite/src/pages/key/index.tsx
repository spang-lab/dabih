import useSession from '@/Session';
import { Link, Navigate } from 'react-router';
import LoadKey from './LoadKey';
import CreateKey from './CreateKey';
import { Clock } from 'react-feather';
import { Spinner } from '@/util';

function KeyContent() {
  const { user, status } = useSession();
  if (status === "registered_key_disabled") {
    return (
      <div className="py-10 text-center">
        <Clock className="inline-block m-2 text-blue" size={80} />
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Please
          <span className="text-blue"> wait for an admin </span>
          to confirm your key
        </h2>
        <div className="text-base text-gray-400 sm:text-lg md:text-xl">
          In order to prevent misuse each new key must be
          <span className="text-blue"> enabled </span>
          by a dabih admin.
          <br />
          For now please contact the admin
        </div>
        <Link className="text-blue text-lg font-bold hover:underline" to="/docs/contact">Contact</Link>
      </div>
    );
  }
  if (status === "registered") {
    return (
      <LoadKey />
    );
  }

  if (status === "registered_without_key") {
    return (
      <CreateKey />
    );
  }
  return (
    <div className="flex justify-center mt-10">
      <Spinner />
    </div>
  );
}




export default function ManageKey() {
  const { user, status } = useSession();

  if (!user) {
    return <Navigate to="/signin" />;
  }
  if (status === "authenticated") {
    return <Navigate to="/manage" />;
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold pb-4 tracking-tight sm:text-5xl md:text-6xl">
        Load your
        <span className="text-blue"> encryption key </span>
      </h1>
      <div className="text-base text-gray-400 sm:text-lg md:text-xl">
        <p>
          <span className="font-semibold text-blue"> Dabih </span>
          {' '}
          uses
          asymmetric key pairs for data encryption.
        </p>
        <p>Each key has two parts:</p>
        <ul className="px-4 leading-relaxed list-disc">
          <li>
            A public key, used to
            <span className="font-semibold text-blue"> encrypt </span>
            the data.
            <br />
            The public key will be sent to
            <span className="font-semibold text-blue"> Dabih </span>
            and will be stored there.
            <br />
            It is public information.
          </li>
          <li>
            A private key, used to
            <span className="font-semibold text-blue"> decrypt </span>
            the data.
            <br />
            The private key should
            <span className="font-semibold text-blue"> never </span>
            be shared and
            <span className="font-semibold text-blue"> only you </span>
            should have it.
          </li>
        </ul>
      </div>
      <KeyContent />
    </div>
  );
}
