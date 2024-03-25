import { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

import Providers from './providers';
import Header from './Header';
import Footer from './Footer';


export const metadata: Metadata = {
  title: 'Spang Lab Dabih',
  description: 'Encrypted data management',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
