"use client";

import useTransfers, { Transfer as TransferType } from "@/lib/hooks/transfers";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronRight } from "react-feather";
import Transfer from "./Transfer";
import { useEffect } from "react";
import handleTransfer from "@/lib/transfer";
import api from "@/lib/api";
import useFiles from "@/lib/hooks/files";

export default function Transfers() {
  const transfers = useTransfers((state) => state.transfers);
  const updateTransfer = useTransfers((state) => state.updateTransfer);
  const addTransfer = useTransfers((state) => state.addTransfer);
  const list = useFiles((state) => state.list);
  const cwd = useFiles((state) => state.cwd);


  const isActive = (transfer: TransferType) =>
    !["complete", "error", "interrupted"].includes(transfer.status);

  const requiresList = (t1: TransferType, t2: TransferType) => {
    const oldStatus = t1.status;
    const newStatus = t2.status;
    if (oldStatus === "finishing" && newStatus === "complete") {
      return true;
    }
    if (oldStatus === "preparing" && newStatus === "uploading") {
      return true;
    }
    return false;
  }



  useEffect(() => {
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
      console.log("incomplete transfers", transfers);
      transfers.forEach(addTransfer);
    })();
  }, []);


  useEffect(() => {
    const transfer = transfers.find(isActive);
    if (!transfer) {
      return;
    }
    (async () => {
      const t = await handleTransfer(transfer);
      if (requiresList(transfer, t)) {
        await list(cwd);
      }


      updateTransfer(t);
    })().catch(console.error);
  }, [transfers]);


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
            <div className="absolute bg-orange text-white text-xs flex justify-center items-center w-5 h-5 rounded-full -top-1 -right-1 border border-white border-gray-200">
              {transfers.length}
            </div>
          </DisclosureButton>
        </div>
      </Disclosure>
    </div>
  );

}
