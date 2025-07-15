import { Mail } from "react-feather";
import { Link } from "react-router";


export default function Email() {
  return (
    <div className="flex flex-col items-center pt-10">
      <Mail size={80} className="text-blue mb-4" />
      <h1 className="text-2xl text-blue pb-4 font-extrabold tracking-tight sm:text-5xl md:text-6xl">
        Check your email
      </h1>
      <p className="text-xl">
        We have sent you an email with a link to sign in. Please check your inbox and click the link to continue.
      </p>
      <Link to="/" className="mt-4 text-blue hover:underline">
        Back to home
      </Link>
    </div>
  );
}
