import React from 'react';
import Image from 'next/image';

import { useRouter } from 'next/router';
import {
  Container,
  BigButton,
  Title1,
  Title2,
  Subtitle1,
  SpangLabBrand,
  BrowserSupport,
  Navigation,
  Color,
  Title3,
  Highlight,
} from '../components';

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <Container>
        <Navigation />
      </Container>
      <Container>
        <BrowserSupport />
        <div className="flex flex-row">
          <div className="p-3 basis-3/4">
            <span className="block p-3 m-3 text-3xl font-extrabold text-center border rounded-full text-rose-700 border-rose-700">
              Alpha version, not for production use
            </span>

            <Title1>
              Welcome to the
              <br />
              <Color>
                Dabih data storage platform
              </Color>

            </Title1>
            <div className="flex pt-2">
              <SpangLabBrand />
            </div>
            <Subtitle1>
              <ul className="px-4 list-disc">
                <li> A secure way to upload and share data</li>
                <li> You decide who gets access to your data</li>
                <li> End to end encrypted, rendundant data storage </li>
                <li> Simple to use </li>
              </ul>
            </Subtitle1>
            <div className="mt-5">
              <BigButton
                onClick={() => router.push('/account')}
              >
                Get Started
              </BigButton>
            </div>
          </div>
          <div className="basis-1/4">
            <div className="relative w-32 h-32 truncate border-4 rounded-full shadow-xl border-sky-800 lg:w-72 lg:h-72">
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
          <Title2 className="pt-10 pb-3">How Dabih works</Title2>
          First and foremost dabih provides an API for
          <Color>uploading</Color>
          ,
          <Color>storing</Color>
          ,
          <Color>sharing</Color>
          and
          <Color>downloading</Color>
          arbirary data.
          <br />
          The
          <Color>key</Color>
          difference for dabih is that we
          <Highlight>guarantee</Highlight>
          that no one except the people
          defined by dabih have access to the data,
          not even system administrators or people with
          pysical access to the hard-disks the data is stored on.
          <Title3 className="pt-10 pb-3">
            <Color>Symmetric</Color>
            {' '}
            Cryptograpy

          </Title3>

          This is possible because we never store the data we receive directly.

          <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
            <Image
              width={1772}
              height={408}
              src="/images/docs/upload.svg"
              alt="Schematic overview of dabih data upload"
            />
          </div>
          When you upload data to dabih we generate a random key in memory
          and use symmetric encrytion (AES-256-CBC) to
          encrypt data before it is stored.
          <br />
          This only changes the problem of safely storing data to safely
          storing the AES key of the data. This is still useful since the key
          will only have 32 bytes.

          <Title3 className="pt-10 pb-3">
            <Color>Asymmetric</Color>
            {' '}
            Cryptograpy

          </Title3>
          For the key storage we will encrypt the AES key again,
          but now using asymmetric encryption.
          <p>
            Asymmetric encryption is called
            {' '}
            <i>asymmetric</i>
            {' '}
            because there are 2 different keys:
          </p>
          <ul className="px-4 leading-relaxed list-disc">
            <li>
              A public key, used to
              <Highlight>encrypt</Highlight>
              the data.
              <br />
              The public key will be sent to
              <Highlight>Dabih</Highlight>
              and will be stored there.
              <br />
              It is public information.
            </li>
            <li>
              A private key, used to
              <Highlight>decrypt</Highlight>
              the data.
              <br />
              The private key should
              <Highlight>never</Highlight>
              be shared and
              <Highlight>only you</Highlight>
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
            <Highlight>dabih</Highlight>
            allows you to easily generate such a keypair on your computer
            and then send the public key to the server.
          </p>
          <p>
            You will only need to do this once, and for security reasons
            every key needs to be confirmed by an admin first.
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
          The encrypted key is stored and can only be decrypted using the private key that
          <Highlight>dabih</Highlight>
          does not have.
          <Title3 className="pt-10 pb-3">
            <Color>
              Download
            </Color>
          </Title3>
          If this dataset is downloaded a two-step decryption process is required.
          <Highlight>First</Highlight>
          the encrypted AES key is downloaded and is decrypted using the private key.
          This results in the unencrypted AES key.
          <Highlight>Then</Highlight>
          the encrypted dataset is downloaded and decrypted using
          the newly aquired AES key.
          <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
            <Image
              src="/images/docs/download.svg"
              alt="Schematic overview of dabih data download"
              width={1772}
              height={579}
            />
          </div>
          <Highlight>Note:</Highlight>
          This guarantees that only the client with the private key can access the dataset.
          <Title3 className="pt-10 pb-3">
            Data
            <Color>
              Sharing
            </Color>
          </Title3>
          Of course we also need a way to safely share datasets with other users.
          Because
          <Highlight>dabih</Highlight>
          itself cannot access the data only a user
          who already has access can share the dataset with others.
          Data sharing is similar to downloading, but only the AES key is downloaded.
          This key is then sent back to
          <Highlight>dabih</Highlight>
          and encrypted with the public key of the new user.
          <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
            <Image
              src="/images/docs/share.svg"
              alt="Schematic overview of dabih data sharing"
              width={1772}
              height={579}
            />
          </div>
          <Highlight>dabih</Highlight>
          keeps a record of users who have access (or used to have access) to dataset
          and has 2 different kinds of permissions.
          <ul className="px-4 list-disc">
            <li>
              <Highlight>read</Highlight>
              permission allows the user to download the dataset.
            </li>
            <li>
              <Highlight>write</Highlight>
              permission additionally allows the user to edit and share the dataset with others.
            </li>
          </ul>
          We also keep a fingerprint of the AES key and check it, to prevent malicious clients
          from secretly exchanging the AES key.
          <br />
          <Highlight>Note:</Highlight>
          If users have access to the dataset once there are external risks.
          There is now way to prevent others from having/keeping a copy of the dataset
          on a laptop or other storage medium.
          <Title3 className="pt-10 pb-3">
            Data
            <Color>
              Deletion
            </Color>
          </Title3>
          Generally users can also delete datasets from
          <Highlight>dabih</Highlight>
          .
          But by default deletion does not remove the underlying files and keys, and the dataset
          can be recovered by an admin.
          <Highlight>dabih</Highlight>
          {' '}
          admins can decide to
          <Highlight>destroy</Highlight>
          {' '}
          and dataset. Destroying a dataset deletes all its data and is irrevokable.
          <Title3 className="pt-10 pb-3">
            <Color>
              Reencryption
            </Color>
          </Title3>
          <div className="relative w-full mx-auto lg:w-3/4 xl:w-2/3">
            <Image
              src="/images/docs/reencrypt.svg"
              alt="Schematic overview of dabih data sharing"
              width={1772}
              height={960}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
