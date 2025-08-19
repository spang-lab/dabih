"use client";

import useTransfers, { Transfer as TransferType } from "@/lib/hooks/transfers";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronRight } from "react-feather";
import { useEffect, useRef } from "react";
import api from "@/lib/api";
import useFiles from "@/lib/hooks/files";
import transferWorker from "@/lib/transferWorker?worker";


import UploadTransfer from "./Upload";
import DownloadTransfer from "./Download";
import useSession from "@/Session";


function Transfer({ data }: { data: TransferType }) {
  const { type } = data;
  if (type === "upload") {
    return <UploadTransfer data={data} />;
  }
  if (type === "download") {
    return <DownloadTransfer data={data} />;
  }
  return null;
}

export default function Transfers() {
  const { status, token } = useSession();
  const workerRef = useRef<Worker | null>(null);
  const transfers = useTransfers((state) => state.transfers);
  const updateTransfer = useTransfers((state) => state.updateTransfer);
  const addTransfer = useTransfers((state) => state.addTransfer);
  const list = useFiles((state) => state.list);
  const cwd = useFiles((state) => state.cwd);


  const isActive = (transfer: TransferType) =>
    !["complete", "error", "interrupted"].includes(transfer.status);


  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    workerRef.current ??= new transferWorker();
    const worker = workerRef.current;
    worker.onmessage = async (e: MessageEvent<TransferType>) => {
      const transfer = e.data;
      if (!transfer) {
        return;
      }
      updateTransfer(transfer);
      if (transfer.type === "upload" && transfer.requiresList) {
        await list(cwd)
      }
    };
    worker.postMessage(token);

    void (async () => {
      const { data: incomplete } = await api.upload.unfinished();
      if (!incomplete || incomplete.length === 0) {
        return;
      }
      const transfers = incomplete.map((inode) => ({
        id: inode.id,
        type: "upload",
        status: "interrupted",
        inode,
      })) as TransferType[];
      transfers.forEach(addTransfer);
    })();
  }, [addTransfer, cwd, list, updateTransfer, status, token]);


  useEffect(() => {
    const worker = workerRef.current;
    const transfer = transfers.find(isActive);
    if (!transfer || !worker) {
      return;
    }
    worker.postMessage(transfer);
  }, [transfers, workerRef]);


  return (
    <div className="fixed bottom-10 right-10 p-2 w-[500px]" hidden={transfers.length === 0}>
      <Disclosure defaultOpen={true}>
        <DisclosurePanel
          transition
          className="origin-bottom transition duration-200 ease-out data-closed:translate-y-3 data-closed:opacity-0 pb-2"
        >
          <div className="bg-white border border-blue p-2 shadow-xl rounded-xl">
            {transfers.map((transfer) => (
              <Transfer key={transfer.id} data={transfer} />
            ))}
          </div>
        </DisclosurePanel>
        <div className="flex justify-end relative">
          <DisclosureButton className="group bg-blue inline-flex items-center text-white font-extrabold rounded-full px-3 py-2 text-xl shadow-xl">
            <ChevronRight className="group-data-open:-rotate-90" />
            Transfers
            <div className="absolute bg-orange text-white text-xs flex justify-center items-center w-5 h-5 rounded-full -top-1 -right-1 border border-white">
              {transfers.length}
            </div>
          </DisclosureButton>
        </div>
      </Disclosure>
    </div>
  );

}
