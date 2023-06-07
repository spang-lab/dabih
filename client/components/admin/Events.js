import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCcw } from 'react-feather';
import {
  LocalDate, MutedButton,
} from '../util';
import { useAdminApi } from '../api';

import DateSelect from './DateSelect';

function Event({ data }) {
  const {
    createdAt, sub, mnemonic, message,
  } = data;
  return (
    <div className="flex flex-row p-1 border-b space-x-4">
      <LocalDate value={createdAt} />
      <span>{'>>'}</span>
      <span className="text-sky-700">
        {' '}
        {mnemonic}
        {' '}
      </span>
      <span className="font-semibold text-sky-700">
        {' '}
        {sub}
        {' '}
      </span>
      <span className="text-gray-500">{message}</span>
    </div>
  );
}

export default function Events() {
  const api = useAdminApi();
  const [eventDates, setEventDates] = useState([]);
  const [selectedDate, setDate] = useState(null);
  const [events, setEvents] = useState([]);

  const getEvents = useCallback(async () => {
    if (!selectedDate || !api.isReady()) {
      return;
    }
    const data = await api.listEvents(selectedDate);
    if (data.error) {
      return;
    }
    setEvents(data);
  }, [api, selectedDate]);

  const getEventDates = useCallback(async () => {
    if (!api.isReady()) {
      return;
    }
    const data = await api.listEventDates();
    if (data.error) {
      return;
    }
    setEventDates(data);
    setDate(data[0]);
  }, [api]);

  useEffect(() => {
    getEventDates();
  }, [getEventDates]);

  useEffect(() => {
    getEvents();
  }, [selectedDate, getEvents]);

  return (
    <div>
      <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl">
        Events
      </h3>
      <div className="flex flex-row">
        <div className="my-2">
          <span className="px-2 my-2">Date:</span>
        </div>
        <DateSelect
          dates={eventDates}
          selectedDate={selectedDate}
          setDate={setDate}
        />
        <MutedButton className="mx-2" onClick={() => getEvents()}>
          <RefreshCcw size={18} />
        </MutedButton>
      </div>
      <div className="mx-4 my-2 border border-gray-300 rounded-lg">
        {events.map((e) => (
          <Event key={e.id} data={e} />
        ))}
      </div>
    </div>
  );
}
