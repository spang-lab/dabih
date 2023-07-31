/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import {
  MessageWrapper, ApiWrapper, Header, Footer,
} from '../components';

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Spang Lab Dabih</title>
        <meta name="description" content="Spang Lab Web Components" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <div className="bg-gray-100">
        <div className="container p-4 mx-auto text-gray-800 md:px-12">
          <div className="block px-4 py-10 bg-white rounded-lg shadow-lg md:py-12 md:px-8">
            <MessageWrapper>
              <ApiWrapper>
                <Component {...pageProps} />
              </ApiWrapper>
            </MessageWrapper>
          </div>
        </div>
      </div>
      <Footer />
    </SessionProvider>
  );
}

export default App;
