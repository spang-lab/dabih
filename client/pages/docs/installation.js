import React from 'react';

import {
  Docs,
  Link,
  CodeBlock,
} from '../../components';

function Documentation() {
  return (
    <Docs>
      <div className="text-lg">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          Installing
          <span className="text-main-200">
            {' '}
            Dabih
            {' '}
          </span>
        </h1>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Requirements
        </h2>
        <ul className="p-4 list-disc">
          <li className="py-1">
            Your own (sub)
            <span className="font-semibold text-main-200">
              {' '}
              domain.
              {' '}
            </span>
            Dabih needs https to function properly,
            in this guide we assume you own a domain and can get a certificate via
            {' '}
            <Link target="_blank" href="https://letsencrypt.org">Let&apos;s encrypt</Link>
          </li>
          <li className="py-1">
            An OAuth2 provider. Dabih needs some way to identify users. This provider can
            be Github, Google, Azure (Mircosoft) or many others.
          </li>
          <li className="py-1">
            (Optional) An SQL based database.
            If you do not have one dabih will use an sqlite file at the storage path.
          </li>
        </ul>
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Deploying dabih on a kubernetes cluster.
        </h2>
        TODO
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
          Installing dabih on bare metal.
        </h2>
        This guide assumes you have a linux server.
        We currently do not provide support for Windows based systems,
        but installation should be similar when using Windows Subsytem for Linux(WSL).

        <p className="text-xl font-extrabold">1. Install Nodejs and npm</p>
        <p>
          Visit
          {' '}
          <Link target="_blank" href="https://nodejs.org/en/">nodejs.org</Link>
          {' '}
          to install nodejs and the npm package manager. We recommend Node.js version 18.12.x LTS.
        </p>
        <p>
          <span className="font-semibold text-main-200">
            {' '}
            Do not
            {' '}
          </span>
          install the default apt package for nodejs, it is outdated.
        </p>
        Use
        <CodeBlock>
          node --version
        </CodeBlock>
        to comfirm nodejs was installed properly
        <p className="text-xl font-extrabold">2. Clone the repos</p>
        There are 2 seperate repos that you may need.
        <CodeBlock>
          git clone https://gitlab.spang-lab.de/containers/dabih
        </CodeBlock>
        The first one is the dabih API server. It contains all the logic and data handling,
        but has no user interface.
        It can be used standalone with CLI tools but we recommend you also deploy the dabih client:
        <CodeBlock>
          git clone https://gitlab.spang-lab.de/containers/dabih-client
        </CodeBlock>
        It contains the dabih web application and consumes the api.

        <p className="text-xl font-extrabold">3. Run the API server</p>
        Install all the dependencies
        <CodeBlock>
          {`cd dabih
npm install`}

        </CodeBlock>
        Generate a new root key by running
        <CodeBlock>
          npm run rootKey
        </CodeBlock>
        <p className="p-2">
          <Link href="/docs/configuration">Configure the API server</Link>
        </p>
        Run the server by calling
        <CodeBlock>
          npm run prod
        </CodeBlock>
        You should now see the log output in your terminal.

        <p className="text-xl font-extrabold">4. Run the client</p>

        <p className="text-xl font-extrabold">8. Set up caddy as reverse proxy</p>
      </div>
    </Docs>
  );
}
export default Documentation;
