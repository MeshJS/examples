"use client";

import { useEffect, useState } from "react";

export const Wallet = () => {
  const [Wallet, setWallet] = useState<any | null>(null);
  useEffect(() => {
    const run = async () => {
      try {
        const { CardanoWallet } = await import("@meshsdk/react");
        setWallet(() => CardanoWallet);
      } catch (error) {
        console.error("Error importing MeshProvider:", error);
      }
    };
    run();
  }, [setWallet]);
  
  if (Wallet === null) {
    return <div>Loading...</div>
  }
  return <Wallet/>;
};
