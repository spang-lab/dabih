/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import {
  Layout,
  MessageWrapper,
  ApiWrapper,
} from '../components';

function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Spang Lab Dabih</title>
        <meta name="description" content="Spang Lab Web Components" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <MessageWrapper>
          <ApiWrapper>
            <Component {...pageProps} />
          </ApiWrapper>
        </MessageWrapper>
      </Layout>
    </SessionProvider>
  );
}

export default App;
