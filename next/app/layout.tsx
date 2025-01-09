import { ReactNode } from 'react';
import type { Metadata } from 'next';
import './globals.css';

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
        <div className="flex flex-col h-screen">
          <Header user={user} />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
