import Image from 'next/image';
import Link from 'next/link';
import Department from './Department';
import Organization from './Organization';
import BrowserSupport from './BrowserSupport';

export default function Home() {
  return (
    <div>
      <BrowserSupport />
      <div className="flex flex-row">
        <div className="p-3 basis-3/4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to the
            <br />
            <span className="text-blue"> Dabih data storage platform </span>
          </h1>
          <div className="flex items-center pt-2">
            <div className="px-4">
              <Department />
            </div>
            <Organization />
          </div>
          <div className="text-base text-gray-400 sm:text-lg md:text-xl">
            <ul className="px-4 list-disc">
              <li> A secure way to upload and share data</li>
              <li> You decide who gets access to your data</li>
              <li> End to end encrypted, rendundant data storage </li>
              <li> Simple to use </li>
            </ul>
          </div>
          <div className="py-5 flex flex-row items-center">
            <Link
              className="text-2xl text-white bg-blue rounded-md px-4 py-3"
              href="/signin"
            >
              Get Started
            </Link>
            <Link
              className="text-xl text-blue hover:underline mx-5 px-4 py-3"
              href="/docs"
            >
              Documentation
            </Link>
          </div>
        </div>
        <div className="basis-1/4">
          <div className="relative w-32 h-32 truncate rounded-full shadow-xl lg:w-72 lg:h-72">
            <Image
              alt="Spang Lab Dabih Logo"
              fill
              sizes="99vw"
              className="object-contain"
              src="/images/dabih-logo.png"
            />
          </div>
        </div>
      </div>
      <div className="mt-3 text-lg">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          How dabih works
        </h2>
        First and foremost dabih provides an API for
        <span className="text-blue"> uploading </span>
        ,
        <span className="text-blue"> storing </span>
        ,
        <span className="text-blue"> sharing </span>
        and
        <span className="text-blue"> downloading </span>
        arbirary data.
        <br />
        The
        <span className="text-blue"> key </span>
        difference for dabih is that we
        <span className="font-semibold text-blue"> guarantee </span>
        that no one except the people defined by dabih have access to the data,
        not even system administrators or people with pysical access to the
        hard-disks the data is stored on.
        <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue"> Symmetric </span>
          {' '}
          Cryptograpy
        </h3>
        This is possible because we never store the data we receive directly.
        <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
          <Image
            width={1772}
            height={408}
            src="/images/docs/upload.svg"
            alt="Schematic overview of dabih data upload"
          />
        </div>
        When you upload data to dabih we generate a random key in memory and use
        symmetric encrytion (AES-256-CBC) to encrypt data before it is stored.
        <br />
        This only changes the problem of safely storing data to safely storing
        the AES key of the data. This is still useful since the key will only
        have 32 bytes.
        <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue"> Asymmetric </span>
          {' '}
          Cryptograpy
        </h3>
        For the key storage we will encrypt the AES key again, but now using
        asymmetric encryption.
        <p>
          Asymmetric encryption is called
          {' '}
          <i>asymmetric</i>
          {' '}
          because there are 2
          different keys:
        </p>
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
        <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
          <Image
            src="/images/docs/key_upload.svg"
            alt="Schematic overview of dabih key upload"
            width={1772}
            height={617}
          />
        </div>
        <p>
          <span className="font-semibold text-blue"> dabih </span>
          allows you to easily generate such a keypair on your computer and then
          send the public key to the server.
        </p>
        <p>
          You will only need to do this once, and for security reasons every key
          needs to be confirmed by an admin first.
        </p>
        <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
          <Image
            src="/images/docs/upload_full.svg"
            alt="Schematic overview of dabih upload"
            width={1772}
            height={579}
          />
        </div>
        With this public key we can complete the upload and encrypt the AES key.
        The encrypted key is stored and can only be decrypted using the private
        key that
        <span className="font-semibold text-blue"> dabih </span>
        does not have.
        <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue"> Download </span>
        </h3>
        If this dataset is downloaded a two-step decryption process is required.
        <span className="font-semibold text-blue"> First </span>
        the encrypted AES key is downloaded and is decrypted using the private
        key. This results in the unencrypted AES key.
        <span className="font-semibold text-blue"> Then </span>
        the encrypted dataset is downloaded and decrypted using the newly
        aquired AES key.
        <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
          <Image
            src="/images/docs/download.svg"
            alt="Schematic overview of dabih data download"
            width={1772}
            height={579}
          />
        </div>
        <span className="font-semibold text-blue"> Note: </span>
        This guarantees that only the client with the private key can access the
        dataset.
        <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          Data
          <span className="text-blue"> Sharing </span>
        </h3>
        Of course we also need a way to safely share datasets with other users.
        Because
        <span className="font-semibold text-blue"> dabih </span>
        itself cannot access the data only a user who already has access can
        share the dataset with others. Data sharing is similar to downloading,
        but only the AES key is downloaded. This key is then sent back to
        <span className="font-semibold text-blue"> dabih </span>
        and encrypted with the public key of the new user.
        <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
          <Image
            src="/images/docs/share.svg"
            alt="Schematic overview of dabih data sharing"
            width={1772}
            height={579}
          />
        </div>
        <span className="font-semibold text-blue"> dabih </span>
        keeps a record of users who have access (or used to have access) to
        dataset and has 2 different kinds of permissions.
        <ul className="px-4 list-disc">
          <li>
            <span className="font-semibold text-blue"> read </span>
            permission allows the user to download the dataset.
          </li>
          <li>
            <span className="font-semibold text-blue"> write </span>
            permission additionally allows the user to edit and share the
            dataset with others.
          </li>
        </ul>
        We also keep a fingerprint of the AES key and check it, to prevent
        malicious clients from secretly exchanging the AES key.
        <br />
        <span className="font-semibold text-blue"> Note: </span>
        If users have access to the dataset once there are external risks. There
        is now way to prevent others from having/keeping a copy of the dataset
        on a laptop or other storage medium.
        <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          Data
          <span className="text-blue"> Deletion </span>
        </h3>
        Generally users can also delete datasets from
        <span className="font-semibold text-blue"> dabih </span>
        . But by default
        deletion does not remove the underlying files and keys, and the dataset
        can be recovered by an admin.
        <span className="font-semibold text-blue"> dabih </span>
        {' '}
        admins can
        decide to
        <span className="font-semibold text-blue"> destroy </span>
        {' '}
        and dataset.
        Destroying a dataset deletes all its data and is irrevokable.
        <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
          <span className="text-blue"> Reencryption </span>
        </h3>
        In case of key loss your data can be re-encrypted with a different key.
        <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
          <Image
            src="/images/docs/reencrypt.svg"
            alt="Schematic overview of dabih data sharing"
            width={1772}
            height={960}
          />
        </div>
      </div>
    </div>
  );
}
