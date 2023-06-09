import React from 'react';

export function BigButton(props) {
  const {
    onClick, children, className, disabled,
  } = props;
  const classes = `
    px-8 py-4 text-2xl rounded-xl
    text-gray-light bg-main-mid enabled:hover:bg-main-mid
    enabled:hover:text-white focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-offset-gray-dark focus:ring-white
    disabled:opacity-50 
    ${className}`;

  return (
    <button
      disabled={disabled}
      type="button"
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function Button({ onClick, children, className }) {
  const classes = `
    px-4 py-2 text-lg rounded-lg
    focus:outline-none 
    ${className}`;
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export function MutedButton({ onClick, children, className }) {
  const classes = `
    px-3 py-2 rounded
    border border-gray-mid
    text-gray-dark bg-gray-light hover:bg-gray-mid
    hover:text-white focus:outline-none 
    ${className}`;
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
export function ColoredButton({ onClick, children, className }) {
  const classes = `
    px-3 py-2 text-lg rounded
    text-gray-light bg-main-mid hover:bg-main-mid
    hover:text-white focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-offset-gray-dark focus:ring-white
    ${className}`;
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export function SmallButton({ onClick, children, className }) {
  const classes = `
    px-2 py-1 text-sm rounded
    text-gray-light bg-main-mid hover:bg-main-mid
    focus:ring-offset-2 focus:ring-offset-gray-dark focus:ring-white
    ${className}`;
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export function DeleteButton({ onClick, children, className }) {
  const classes = `
    px-2 py-1 text-sm rounded
    text-gray-light bg-danger hover:bg-rose-600
    hover:text-white focus:outline-none focus:ring-2
    focus:ring-offset-2 focus:ring-offset-gray-dark focus:ring-white
    ${className}`;
  return (
    <button type="button" className={classes} onClick={onClick}>
      {children}
    </button>
  );
}

export function LoginButton(props) {
  const { onClick } = props;

  return (
    <div className="inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
      <button
        type="button"
        onClick={onClick}
        className="px-5 py-2 rounded-full text-gray-light bg-main-mid hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-dark focus:ring-white"
      >
        Sign In
      </button>
    </div>
  );
}

export function LogoutButton(props) {
  const { user, onClick } = props;
  const { name } = user;
  return (
    <div className="inset-y-0 right-0 flex items-center pr-2 sm:inset-auto sm:ml-6 sm:pr-0">
      <span className="hidden text-gray-mid md:block">Logged in as </span>
      <span className="px-1 text-gray-mid">{name}</span>
      <button
        type="button"
        onClick={onClick}
        className="px-5 py-2 rounded-full text-gray-light0 bg-main-dark hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-dark focus:ring-white"
      >
        Sign out
      </button>
    </div>
  );
}
export function UserButton(props) {
  const { user, signIn, signOut } = props;
  if (user) {
    return <LogoutButton user={user} onClick={signOut} />;
  }
  return <LoginButton onClick={signIn} />;
}
