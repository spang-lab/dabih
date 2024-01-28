'use client';

import { RefreshCcw } from 'react-feather';
import {
  LocalDate,
} from '../../util';
import { useProfile } from '../Context';

import DateSelect from './DateSelect';

function Event({ data }) {
  const {
    createdAt, sub, mnemonic, message,
  } = data;
  return (
    <div className="flex flex-row p-1 border-b space-x-4">
      <LocalDate value={createdAt} />
      <span>{'>>'}</span>
      <span className="text-blue">
        {' '}
        {mnemonic}
        {' '}
      </span>
      <span className="font-semibold text-blue">
        {' '}
        {sub}
        {' '}
      </span>
      <span className="text-gray-400">{message}</span>
    </div>
  );
}

export default function Events() {
  const { events, fetchEvents } = useProfile();

  return (
    <div>
      <h3 className="text-lg font-extrabold tracking-tight sm:text-xl md:text-2xl">
        Events
      </h3>
      <div className="flex flex-row">
        <div className="my-2">
          <span className="px-2 my-2">Date:</span>
        </div>
        <DateSelect />
        <button aria-label="refresh" type="button" className="mx-2" onClick={() => fetchEvents()}>
          <RefreshCcw size={18} />
        </button>
      </div>
      <div className="mx-4 my-2 border border-gray-400 rounded-lg max-h-80 overflow-auto">
        {events.map((e) => (
          <Event key={e.id} data={e} />
        ))}
      </div>
    </div>
  );
}
