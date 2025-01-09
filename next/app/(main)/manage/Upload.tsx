"use client";

import { UploadCloud } from "react-feather";
import useFinder from "./Context";
import useTransfers from "@/lib/hooks/transfers";

export default function Upload() {
  const { parents } = useFinder();
  const cwd = parents[0]?.mnemonic ?? null;

  const addTransfer = useTransfers((state) => state.addTransfer);
  return (
    <div>
      <button
        type="button"
        aria-label="Upload"
        className="inline-flex items-center px-4 py-2 text-white bg-blue rounded-lg"
        onClick={() => { addTransfer(`upload to ${cwd}`); }}
      >
        <UploadCloud className="mr-2" />
        Upload
      </button>
    </div>
  );
}
