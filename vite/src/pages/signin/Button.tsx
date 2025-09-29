import { AuthProvider } from "@/lib/api/types/auth";

export default function SignInButton({ data, onClick }: { data: AuthProvider, onClick: () => void }) {
  const { name, logo } = data;
  return (
    <button className="border w-full rounded-md px-4 py-2 my-1 border-gray-200 flex items-center space-x-2 hover:bg-gray-100"
      onClick={onClick}>
      {logo && <img src={logo} alt={name} className="h-6 w-6" />}
      <span>Sign in with {name}</span>
    </button>
  );
}
