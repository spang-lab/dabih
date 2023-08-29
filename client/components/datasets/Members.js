'use client';

import React from 'react';
import { Disclosure } from '@headlessui/react';
import { Users, ChevronRight } from 'react-feather';
import { useUsers } from '../hooks';
import AddMember from './AddMember';
import Member from './Member';

const resolveMembers = (users, mems) => {
  const memberIndex = mems.reduce((acc, m) => {
    if (m.permission !== 'none') {
      acc[m.sub] = m;
    }
    return acc;
  }, {});

  const members = [];
  const addable = [];
  if (!users) {
    return {
      members,
      addable,
    };
  }

  users.forEach((u) => {
    const member = memberIndex[u.sub];
    if (member) {
      members.push({
        ...member,
        name: u.name,
        email: u.email,
      });
    } else {
      addable.push(u);
    }
  });

  return {
    members,
    addable,
  };
};

export default function Members({ data }) {
  const { users } = useUsers();
  if (!data.members) {
    return null;
  }

  const { members, addable } = resolveMembers(users, data.members);

  const getCount = () => {
    const count = members.length;
    if (count === 1) {
      return '1 user';
    }
    return `${count} users`;
  };

  return (
    <div className="w-full px-4">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex w-full px-4 my-1 text-lg font-bold text-blue focus:outline-none focus-visible:ring focus-visible:ring-gray-1000 focus-visible:ring-opacity-75">
              <ChevronRight
                size={24}
                className={open ? 'rotate-90 transform' : ''}
              />
              <Users className="ml-3" size={20} />
              <span className="mx-1 underline-offset-2 hover:underline">
                Members
              </span>
              <span className="px-3 py-1 text-sm text-white rounded-full bg-blue">
                {getCount()}
              </span>
            </Disclosure.Button>
            <Disclosure.Panel className="text-gray-400 border rounded-lg">
              {members.map((m) => (
                <Member key={m.sub} data={m} dataset={data} />
              ))}
              <AddMember dataset={data} options={addable} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
