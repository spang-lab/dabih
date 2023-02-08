import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

import {
  Container,
  Highlight,
  Subtitle1,
  Title1,
  Upload as Uploader,
  useApi,
  Link,
} from '../../components';

export default function Upload() {
  const [user, setUser] = useState({});
  const [agreed, setAgree] = useState(false);
  const toggle = () => setAgree(!agreed);

  const api = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      const u = await api.getUser();
      setUser(u);
    };
    if (api.isReady()) {
      fetchUser();
    }
  }, [api]);

  return (
    <div>
      <Container>
        <Title1>
          Data
          {' '}
          <span className="text-sky-700">ingress</span>
        </Title1>
        <Subtitle1>
          This page is used to send data to someone else, you
          {' '}
          <span className="font-bold">do not need</span>
          {' '}
          and account
          or a crypo key yourself.
        </Subtitle1>

        <div className="flex flex-row items-center py-3">
          <Switch
            checked={agreed}
            onChange={toggle}
            className={`${agreed ? 'bg-emerald-700' : 'bg-gray-300'}
    relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">Key enabled</span>
            <span
              aria-hidden="true"
              className={`${agreed ? 'translate-x-6' : 'translate-x-0'}
      pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <div className="pl-3">
            I agreed to share my data with
            <Highlight>
              {user.name}
            </Highlight>
            and i have read and agree to the
            {' '}
            <Link target="_blank" href="/data_policy">
              Data Policy
            </Link>
          </div>
        </div>

        <p className="pt-5 text-3xl text-center">
          <span className="font-bold">Note: </span>
          Uploaded data will be sent to
          <Highlight>{user.name}</Highlight>
        </p>
        <Uploader disabled={!agreed} />

      </Container>
    </div>
  );
}
