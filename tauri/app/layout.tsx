import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Providers from './Providers';
import Header from './Header';

export const metadata: Metadata = {
  title: 'Dabih Uploader',
  description: 'Tool to upload data to dabih',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-800 text-white">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
