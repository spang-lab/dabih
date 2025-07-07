import { Mail } from "react-feather";
import useSession from "@/Session";
import { useState } from "react";
import { Navigate } from "react-router";

export default function SignIn() {
  const [email, setEmail] = useState("");

  const { signIn, user, token } = useSession();

  if (user) {
    return <Navigate to="/key" />
  }


  return (
    <div>
      <pre> {JSON.stringify(user, null, 2)}</pre>
      <pre> {JSON.stringify(token, null, 2)}</pre>
      <h1 className="text-4xl pb-4 font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Sign in to
        {' '}
        <span className="text-blue">your account</span>
      </h1>
      <div className="flex max-w-md mx-auto my-10">
        <form onSubmit={(e) => {
          e.preventDefault()
          signIn(email);
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
