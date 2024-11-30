"use client";

import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";
import { Address as AddressType } from "@starknet-react/chains";

const Popup: NextPage = () => {
  const connectedAddress = useAccount();

  return (
    <div className="w-[350px] h-[500px] p-4 bg-base-100">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold">Scaffold-Stark</h1>
          {connectedAddress.address ? (
            <div className="mt-2">
              <div className="text-sm text-[#00A3FF] mb-1">Connected Address:</div>
              <Address address={connectedAddress.address as AddressType} />
            </div>
          ) : (
            <button className="btn btn-primary mt-2">Connect Wallet</button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="grid gap-4">
            <div className="p-4 rounded-lg border border-gradient">
              <h2 className="font-semibold mb-2">Balance</h2>
              {/* Add balance info here */}
            </div>

            <div className="p-4 rounded-lg border border-gradient">
              <h2 className="font-semibold mb-2">Recent Transactions</h2>
              {/* Add transaction list here */}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-sm">
          <button className="btn btn-sm">Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;