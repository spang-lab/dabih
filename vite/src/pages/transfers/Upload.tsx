import { Bytes } from "@/app/util";
import useTransfers from "@/lib/hooks/transfers";
import type { Upload } from "@/lib/hooks/transfers";
import { Upload as UploadIcon, X } from "react-feather";
import FileName from "../manage/inode/Filename";


export default function UploadTransfer({ data }: { data: Upload }) {
  const { status } = data;

  const clearTransfer = useTransfers((state) => state.clearTransfer);


  const getStatus = () => {
    const inode = data.inode;
    const fileName = inode?.name ?? data.file?.name ?? "";
    const mnemonic = inode?.mnemonic;
    const error = data.error;

    switch (status) {
      case "error":
        return (
          <div className="text-xs">
            <div className="font-mono py-1">
              <FileName fileName={fileName} />
            </div>
            <span className="bg-red text-white font-bold px-2 py-1 mx-2 rounded-full">Error</span>
            <span className="text-red text-xs">
              {error}
            </span>
          </div>
        );
      case "interrupted":
        return (
          <div className="text-xs text-left py-1">
            <span className="bg-orange text-white font-bold px-2 py-1 mx-2 rounded-full">Interrupted</span>
            <span className="font-mono py-1">
              <FileName fileName={fileName} />
            </span>

          </div >
        );
      case "complete":
        return (
          <div className="text-xs text-left py-1 flex items-center">
            <div className="bg-green text-white font-bold px-2 py-1 mx-2 rounded-full">Complete</div>
            <div className="font-mono py-1">
              <FileName fileName={fileName} />
              <p className="text-blue font-mono font-extrabold">
                {mnemonic}
              </p>
            </div>
          </div >
        );
      case "uploading":
        return (
          <div>
            Uploading
            {" "}
            <FileName fileName={fileName} />
            {" "}
            as
            {" "}
            <p className="text-blue font-mono font-extrabold">
              {mnemonic}
            </p>
          </div>
        );
      default:
        return `Transfer ${status}: ${fileName}`;
    }
  }

  const getProgress = () => {
    const inode = data.inode;
    const chunks = inode?.data.chunks;
    if (!chunks) {
      return null;
    }
    const total = parseInt(inode.data.size as string, 10);
    const current = parseInt(chunks.at(-1)?.end as string, 10) ?? 0;
    const percent = Math.round((1000 * current) / total) / 10;
    const width = `${Math.round(percent)}%`;
    return (
      <div className="flex items-center">
        <div className="text-xs font-mono font-bold text-gray-800 px-1 w-20">
          {percent.toFixed(1)}%
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue h-2 rounded-full" style={{ width }}>
          </div>
        </div>
        <div className="ml-2 font-mono text-[11px] text-gray-600 text-nowrap w-40">
          <Bytes value={current} />
          {" "}
          /
          {" "}
          <Bytes value={total} />
        </div>
      </div>
    );


  }


  return (
    <div className="flex items-center py-2 border-b last:border-none border-gray-200">
      <div className="text-[10px] font-bold text-blue border-r border-gray-200 px-2">
        <UploadIcon className="mx-auto" size={24} />
        Upload
      </div>
      <div className="grow">
        <div className="text-xs text-center">
          {getStatus()}
        </div>
        {getProgress()}
      </div>
      <div>
        <button
          type="button"
          className="text-gray-500 p-2"
          onClick={() => void clearTransfer(data.id)}
        >
          <X size={16} />
        </button>
      </div >
    </div >
  );
}
