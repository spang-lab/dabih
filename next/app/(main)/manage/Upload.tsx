"use client";

import { useState } from "react";

import { UploadCloud } from "react-feather";
import useFinder from "./Context";
import UploadDialog from "@/app/dialog/Upload";

export default function Upload() {
  const { parents } = useFinder();
  const cwd = parents[0]?.mnemonic ?? null;

  const [showUpload, setShowUpload] = useState<boolean>(false);
  const onCloseUpload = () => setShowUpload(false);



  return (
    <div className="py-2">
      <UploadDialog cwd={cwd} show={showUpload} onClose={onCloseUpload} />
      <button
        type="button"
        aria-label="Upload"
        className="inline-flex items-center px-4 py-2 text-white bg-blue rounded-lg"
        onClick={() => setShowUpload(true)}
      >
        <UploadCloud className="mr-2" />
        Upload...
      </button>
    </div>
  );
}
