"use client";

import React from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function WalletButton() {
  return (
    <div className="inline-flex">
      <WalletMultiButton className="!bg-black !text-white !rounded-full !px-4 !py-2 !text-sm hover:!opacity-80" />
    </div>
  );
}


