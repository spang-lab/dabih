import React from 'react';

import { useSession, signIn, signOut } from 'next-auth/react';
import Header from './Header';
import Footer from './Footer';

import info from '../package.json';

function Layout(props) {
  const { children } = props;

  const links = [
    { href: '/', label: 'Home' },
    { href: '/docs', label: 'Documentation' },
    { href: '/contact', label: 'Contact' },
  ];

  const { data: session } = useSession();
  const user = (session) ? session.user : null;

  return (
    <div className="layout">
      <Header
        links={links}
        user={user}
        signIn={signIn}
        signOut={signOut}
      />
      {children}
      <Footer version={info.version} />
    </div>
  );
}
export default Layout;
