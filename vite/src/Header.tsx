

import { Link } from 'react-router';
import {
  UserPlus,
  Key,
  Share2,
  Home,
  User as UserIcon,
  LogOut,
  Settings,
} from 'react-feather';

import NavItem from './NavItem';
import { useLocation } from 'react-router';
import useSession from './Session';

function NavLine() {
  return <div className="flex-auto mx-3 h-6 border-t-2 border-gray-300" />;
}

const usePage = () => {
  const { pathname } = useLocation()
  const page = pathname?.split('/')[1] || 'start';
  return page;
};

type PageStatus = 'complete' | 'enabled' | 'disabled' | 'active';


export default function Header() {
  const { user, key, signOut } = useSession();
  const page = usePage();


  const hasUser = !!user;
  const hasKey = !!key;


  const state: { [key: string]: PageStatus } = {
    start: 'complete',
    signin: (hasUser) ? 'complete' : 'enabled',
    key: (hasUser) ? (hasKey) ? 'complete' : 'enabled' : 'disabled',
    manage: (hasKey) ? 'enabled' : 'disabled',
    profile: (hasUser) ? 'enabled' : 'disabled',
  };
  state[page] = 'active';


  const getSignIn = () => {
    if (hasUser) {
      return (
        <>
          <NavLine />
          <button onClick={() => signOut()} type="button">
            <NavItem href="" state="enabled" label="Sign Out">
              <LogOut size={24} />
            </NavItem>
          </button>
        </>
      );
    }
    return (
      <>
        <NavLine />
        <button onClick={() => { }} type="button">
          <NavItem href="" state="enabled" label="Sign In">
            <UserIcon size={24} />
          </NavItem>
        </button>
      </>
    );
  };

  return (
    <nav className="bg-blue">
      <div className="max-w-7xl mx-auto flex items-center py-2 px-16">
        <Link to="/">
          <div className="relative flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 py-3 rounded-full">
              <img
                className="block w-auto h-10 rounded-full"
                src="/images/dabih-logo.png"
                width={40}
                height={40}
                alt="Dabih"
              />
            </div>
            <div className="pt-2 text-xs text-white font-semibold text-center uppercase">
              Dabih
            </div>
          </div>
        </Link>
        <NavLine />
        <NavItem href="/" state={state.start} label="Home">
          <Home size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/signin" state={state.signin} label="Account">
          <UserPlus size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/key" state={state.key} label="Key">
          <Key size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/manage" state={state.manage} label="Manage">
          <Share2 size={24} />
        </NavItem>
        <NavLine />
        <NavItem href="/profile" state={state.profile} label="Settings">
          <Settings size={24} />
        </NavItem>
        {getSignIn()}
      </div>
    </nav>
  );
}
