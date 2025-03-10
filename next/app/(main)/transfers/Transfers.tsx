"use client";

import useTransfers, { Transfer as TransferType } from "@/lib/hooks/transfers";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronRight } from "react-feather";
import Transfer from "./Transfer";
import { useEffect } from "react";
import handleTransfer from "@/lib/transfer";

export default function Transfers() {

  const transfers = useTransfers((state) => state.transfers);
  const updateTransfer = useTransfers((state) => state.updateTransfer);



  const isActive = (transfer: TransferType) =>
    !["complete", "error", "interrupted"].includes(transfer.status);



  useEffect(() => {
    const transfer = transfers.find(isActive);
    if (!transfer) {
      return;
    }
    (async () => {
      const t = await handleTransfer(transfer);
      updateTransfer(t);
    })().catch(console.error);
  }, [transfers]);


  return (
    <div className="fixed bottom-10 right-10 p-2 w-96" hidden={transfers.length === 0}>
      <Disclosure>
        <DisclosurePanel
          transition
          className="origin-bottom transition duration-200 ease-out data-closed:translate-y-3 data-closed:opacity-0 pb-2"
        >
          <div className="bg-white border border-blue p-2 shadow-xl rounded-xl  border-gray-200">
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
