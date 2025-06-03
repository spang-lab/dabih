import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { useState } from "react";
import { ChevronsDown, User, UserPlus } from "react-feather";
import useFinder from "../Context";
import { InodeMembers, UserResponse } from "@/lib/api/types";

export default function AddMember(
  { hidden,
    inode
  }: {
    inode: InodeMembers,
    hidden?: boolean
  }
) {

  const [selected, setSelected] = useState<UserResponse | null>(null);
  const [query, setQuery] = useState('');
  const { members, mnemonic } = inode;
  const memberIds = new Set(members.map((member) => member.sub));

  const q = query.toLowerCase().replace(/\s/g, '');

  const { users, addMember } = useFinder();



  const addable = Object.values(users ?? {})
    .filter((user) => user.keys.find((k) => k.enabled))
    .filter((user) => !memberIds.has(user.sub))
    .filter((user) => {
      const e = user.email.toLowerCase().replace(/\s/g, '');
      const s = user.sub.toLowerCase().replace(/\s/g, '');
      return !q.length || e.includes(q) || s.includes(q);
    });
  const display = (o: UserResponse | null) => {
    if (!o) {
      return '';
    }
    return `${o.name} (${o.email})`;
  }


  if (hidden) {
    return null;
  }
  return (
    <div className="flex items-center">
      <Combobox value={selected} onChange={setSelected}>
        <div className="grow flex my-2 border rounded-lg overflow-hidden border-gray-200">
          <ComboboxInput
            className="w-full pl-3 text-blue"
            displayValue={display}
            onChange={(e) => setQuery(e.target.value)}
          />
          <ComboboxButton className="px-2 py-1">
            <ChevronsDown size={24} className="text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <ComboboxOptions
          transition
          anchor="bottom"
          className="divide-y border rounded-sm bg-white border-gray-200"
        >
          {addable.map((user) => (
            <ComboboxOption
              value={user}
              className={({ active }) => `py-2 px-4 ${active ? 'bg-blue/40' : ''}`}
              key={user.sub}
            >
              <User className="inline-block" size={14} />
              <span className="text-blue font-semibold">
                {user.email}
              </span>
              <span className="text-gray-600 px-3">
                (id:
                {' '}
                {user.sub}
                )
              </span>
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </Combobox>
      <div className="pl-2">
        <button
          type="button"
          disabled={!selected}
          className="whitespace-nowrap bg-blue py-1 px-2 text-white text-sm rounded-md disabled:bg-blue/50"
          onClick={() => {
            addMember(mnemonic, selected!.sub)
            setSelected(null);
          }}
        >
          <UserPlus className="inline-block mr-2" size={18} />
          Add
        </button>
      </div>
    </div >
  );
}
