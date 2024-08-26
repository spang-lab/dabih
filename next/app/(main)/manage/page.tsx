import Finder from "./Finder";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Manage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div>
      <h1 className="text-4xl font-extrabold pb-3 tracking-tight sm:text-5xl md:text-6xl">
        Manage
        <span className="text-blue"> your files</span>
      </h1>
      <div>
        <Finder />
      </div>
    </div>
  );
} 
