/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head';
import React from 'react';
import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import {
  DialogWrapper, ApiWrapper, Header, Footer,
} from '../components';

function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Spang Lab Dabih</title>
        <meta name="description" content="Spang Lab Web Components" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen">
        <DialogWrapper>
          <ApiWrapper>
            <Header />
            <div className="bg-gray-50 flex flex-1 justify-stretch items-stretch">
              <div className="container p-4 mx-auto text-gray-800 md:px-12">
                <div className="block h-full px-4 py-10 bg-white rounded-lg shadow-lg md:py-12 md:px-8">
                  <Component {...pageProps} />
                </div>
              </div>
            </div>
            <Footer />
          </ApiWrapper>
        </DialogWrapper>
      </div>
    </SessionProvider>
  );
}

export default App;
