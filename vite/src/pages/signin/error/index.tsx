import { Link, useSearchParams } from "react-router";



export default function SignInError() {
  const [params] = useSearchParams();
  const message = params.get("message") || "Unknown error";
  return (
    <div>
      <h1 className="text-4xl pb-4 text-center font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Sign in
        {' '}
        <span className="text-red">failed</span>
      </h1>
      <div className="bg-red/30 border border-red text-red px-4 py-3 rounded relative mb-4 text-center">
        <strong className="font-bold">Error: </strong>
        <span className="block px-4 sm:inline">{message}</span>
      </div>
      <div className="flex justify-center">
        <Link to="/signin" className="bg-blue text-white px-2 py-1 rounded text-xl shadow-md">
          Back to sign in
        </Link>
      </div>
    </div>

  );
}
