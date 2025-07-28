import { Bytes } from "@/util";
import useTransfers from "@/lib/hooks/transfers";
import type { Download } from "@/lib/hooks/transfers";
import { Download as DownloadIcon, X } from "react-feather";
import FileName from "../manage/inode/Filename";


export default function DownloadTransfer({ data }: { data: Download }) {
  const { status, mnemonic } = data;

  const clearTransfer = useTransfers((state) => state.clearTransfer);


  const getStatus = () => {
    const error = data.error;

    switch (status) {
      case "error":
        return (
          <div className="text-xs">
            <div className="font-mono py-1">
              {mnemonic}
            </div>
            <span className="bg-red text-white font-bold px-2 py-1 mx-2 rounded-full">Error</span>
            <span className="text-red text-xs">
              {error}
            </span>
          </div>
        );
      case "complete": {
        const file = data.result!;
        const url = URL.createObjectURL(file);


        return (
          <div className="text-xs text-left py-1 flex items-center">
            <div className="bg-green text-white font-bold px-2 py-1 mx-2 rounded-full">Complete</div>
            <div className="font-mono py-1">
              <a href={url} download={file.name} className="text-white bg-blue px-2 py-1 rounded-lg font-bold">
                Save
                {" "}
                <FileName fileName={file.name} />
              </a>
              <p className="text-gray-500 font-mono font-extrabold">
                {mnemonic}
              </p>
            </div>
          </div >
        );
      }
      case "downloading":
        return (
          <div>
            Downloading
            <p className="text-blue font-mono font-extrabold">
              {mnemonic}
            </p>
          </div>
        );
      default:
        return `Transfer ${status}: ${mnemonic}`;
    }
  }

  const getProgress = () => {
    const { current, size, status } = data;
    if (!current || !size || status !== "downloading") {
      return null;
    }


    const percent = Math.round((1000 * current) / size) / 10;
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
          <Bytes value={size} />
        </div>
      </div>
    );


  }


  return (
    <div className="flex items-center py-2 border-b last:border-none border-gray-200">
      <div className="text-[10px] font-bold text-blue border-r border-gray-200 px-2">
        <DownloadIcon className="mx-auto" size={24} />
        Download
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
