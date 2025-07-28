"use client";

import { useState } from "react";

import { UploadCloud } from "react-feather";
import UploadDialog from "@/dialog/Upload";
import useFiles from "@/lib/hooks/files";

export default function Upload() {
  const cwd = useFiles((state) => state.cwd);

  const [showUpload, setShowUpload] = useState<boolean>(false);
  const onCloseUpload = () => setShowUpload(false);



  return (
    <div className="py-2">
      <UploadDialog cwd={cwd} show={showUpload} onClose={onCloseUpload} />
      <button
        type="button"
        disabled={!cwd}
        aria-label="Upload"
        className="inline-flex items-center px-4 py-2 text-white bg-blue rounded-lg disabled:opacity-50"
        onClick={() => setShowUpload(true)}
      >
        <UploadCloud className="mr-2" />
        Upload...
      </button>
    </div>
  );
}
