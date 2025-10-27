import { Mail } from "react-feather";
import useSession from "@/Session";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router";
import ProviderButton from "./ProviderButton";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { signIn, provider, user, error, clearError } = useSession();

  if (user) {
    return <Navigate to="/key" />
  }


  return (
    <div>
      {error && (
        <div className="bg-red/30 border border-red text-red px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block px-4 sm:inline">{error}</span>
          <button
            onClick={clearError}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            <span className="text-red-500">&times;</span>
          </button>
        </div>
      )}

      <h1 className="text-4xl pb-4 font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Sign in to
        {' '}
        <span className="text-blue">your account</span>
      </h1>
      <div hidden={!provider}>
        <div className="max-w-md mx-auto">
          <h2 className="text-xl pt-5 font-extrabold tracking-tight">
            OpenID
          </h2>
          <ProviderButton provider={provider} />
        </div>
      </div>
      <div className="flex max-w-md mx-auto my-10">
        <form onSubmit={async (e) => {
          e.preventDefault()
          await signIn(email);
          navigate("/email");
        }}>
          <label htmlFor="email">
            <p className="font-extrabold m-1 text-xl">
              Email
            </p>
            <input
              className="border w-full rounded-md px-4 py-2 my-1 border-gray-200"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
              type="email"
            />
          </label>
          <button
            className="px-3 py-2 mt-4 inline-flex items-center text-lg font-semibold bg-blue text-white rounded-md"
            type="submit"
          >
            <Mail size={32} className="pr-3" />
            Sign in with email
          </button>
        </form>
      </div>
    </div>
  );
}
