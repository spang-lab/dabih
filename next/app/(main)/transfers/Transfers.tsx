"use client";

import useTransfers from "@/lib/hooks/transfers";

export default function Transfers() {

  const transfers = useTransfers((state) => state.transfers);


  return (
    <div className="w-1/5 p-2">
      <div className="bg-white rounded-lg shadow-lg p-2" hidden={transfers.length === 0}>
        <h1 className="text-xl text-blue font-extrabold">Transfers</h1>
        {transfers.map((transfer) => (
          <div key={transfer} className="border-y py-2">
            {transfer}
          </div>
        ))}
      </div>
    </div>
  );
}
