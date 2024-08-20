import { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

import Providers from './providers';
import Header from './Header';
import Footer from './Footer';
import { auth } from '@/lib/auth/auth';


export const metadata: Metadata = {
  title: 'Spang Lab Dabih',
  description: 'Encrypted data management',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const user = session?.user;

  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header user={user} />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
