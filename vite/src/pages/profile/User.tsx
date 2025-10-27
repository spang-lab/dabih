import { Scope, UserResponse } from "@/lib/api/types";
import { LocalDate } from "@/util";
import { Switch } from "@/util";
import { Trash2, User } from "react-feather";


export default function UserElem({ user, isAdmin, onRemove, onChange }: {
  user: UserResponse,
  isAdmin: boolean,
  onRemove: (sub: string) => void
  onChange: (sub: string, admin: boolean) => void
}) {

  if (!isAdmin) {
    return null;
  }
  const { sub, email, lastAuthAt } = user;
  const hasAdmin = user.scope.includes(Scope.ADMIN);

  const getState = () => {
    if (hasAdmin) {
      return <div className="px-2 font-bold text-green">Admin</div>;
    }
    return <div className="px-4 font-bold text-gray-500"> User </div>;

  };

  return (
    <div className="border border-gray-400 m-1 rounded-lg py-1 px-2 flex items-center justify-between">
      <div className="inline-flex items-center text-blue font-extrabold text-xl">
        <User className="text-blue mx-3" size={34} />
        Account
      </div>
      <div>
        <a className="text-blue px-2 font-bold" href={`mailto:${email}`}>
          {email}
        </a>
        <span className="text-gray-500 px-3">
          (id: {sub})
        </span>
      </div>
      <div className="text-gray-500 px-2">
        last auth:
        <LocalDate value={lastAuthAt} showTime />
      </div>
      <div className="flex flex-row items-center grow justify-end">
        <div className="flex flex-row items-center px-1 mx-1">
          <Switch enabled={hasAdmin} onChange={() => onChange(sub, !hasAdmin)} />
        </div>
        {getState()}
      </div>
      <div>
        <button
          type="button"
          onClick={() => onRemove(sub)}
          className="bg-red inline-flex items-center text-white px-2 py-1 rounded text-sm shadow-md"
        >
          <Trash2 className="mr-1" size={18} />
          Delete
        </button>
      </div>
    </div>
  );

}
