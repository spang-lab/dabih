import React from 'react';
import { X } from 'react-feather';
import { Transition } from '@headlessui/react';

function CloseButton({ onClick }) {
  const buttonClasses = [
    'absolute',
    'inset-y-0',
    'p-3',
    'my-1',
    'right-3',
    'rounded-md',
    'text-gray-400',
    'hover:text-white',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-inset',
    'focus:ring-white',
  ].join(' ');
  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      aria-label="Close"
    >
      <X size={14} />
    </button>
  );
}

function ErrorMessage({ text, time, onClick }) {
  return (
    <div
      className="relative p-3 m-3 text-base text-white bg-red/80 rounded-lg"
      role="alert"
    >
      <span className="px-3">{time}</span>
      <strong className="px-2">Error:</strong>
      {text}
      <CloseButton onClick={onClick} />
    </div>
  );
}

function SuccessMessage({ text, time, onClick }) {
  return (
    <div
      className="relative p-3 m-3 text-base text-white bg-green/80 rounded-lg"
      role="alert"
    >
      <span className="px-3">{time}</span>
      {text}
      <CloseButton onClick={onClick} />
    </div>
  );
}

function BaseMessage({ text, time, onClick }) {
  return (
    <div
      className="relative p-3 m-3 text-base text-white bg-gray-800 rounded-lg"
      role="alert"
    >
      <span className="px-3">{time}</span>
      {text}
      <CloseButton onClick={onClick} />
    </div>
  );
}

export default function Message(props) {
  const {
    date, text, type, onClick,
  } = props;

  const getMessage = () => {
    const time = date.toLocaleTimeString('en-US', { hour12: false });
    switch (type) {
      case 'error':
        return <ErrorMessage text={text} time={time} onClick={onClick} />;
      case 'success':
        return <SuccessMessage text={text} time={time} onClick={onClick} />;
      default:
        return <BaseMessage text={text} time={time} onClick={onClick} />;
    }
  };
  return (
    <Transition
      show
      appear
      enter="transition-opacity duration-400"
      enterFrom="opacity-0"
      enterTo="opacity-100"
    >
      {getMessage()}
    </Transition>
  );
}
