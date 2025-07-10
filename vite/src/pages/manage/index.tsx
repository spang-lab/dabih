import useSession from "@/Session";
import { FinderWrapper } from "./Context";

import Files from "./Files";
import Info from "./Info";
import Upload from "./Upload";
import { Navigate } from "react-router";

export default function Manage() {
  const { status } = useSession();


  if (status !== "authenticated") {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="">
      <h1 className="text-4xl font-extrabold pb-3 tracking-tight sm:text-5xl md:text-6xl">
        Manage
        <span className="text-blue"> your files</span>
      </h1>

      <FinderWrapper>
        <Upload />
        <div className="flex flex-row">
          <div className="grow">
            <Files />
          </div>
          <div className="w-96 shrink-0">
            <Info />
          </div>
        </div>
      </FinderWrapper>
    </div>
  );
} 
