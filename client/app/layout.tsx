import { ReactNode } from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';

import {
  Header, Footer,
} from '../components';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Spang Lab Dabih',
  description: 'Encrypted data management',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <div className="flex flex-col min-h-screen">
            <div className="bg-gray-50 flex flex-1 justify-stretch items-stretch">
              <div className="container p-4 mx-auto text-gray-800 md:px-12">
                <div className="block h-full px-4 py-10 bg-white rounded-lg shadow-lg md:py-12 md:px-8">
                  {children}

                </div>
              </div>
            </div>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
