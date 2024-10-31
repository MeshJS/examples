"use client";

import { someAction } from "@/actions/meshServer";
import React, { useEffect, useState } from "react";

export const DynamicHookComponent = () => {
  const [useCustomHook, setUseCustomHook] = useState<any>(null);

  useEffect(() => {
    const loadHook = async () => {
      try {
        const { useWallet } = await import("@meshsdk/react");
        const {BrowserWallet} = await import("@meshsdk/core");
        setUseCustomHook(() => useWallet);
        const wallet = await BrowserWallet.enable('eternl');
        const balance = await wallet.getBalance();
        console.log("balance",balance);
        await someAction();
      } catch (error) {
        console.error("Error loading hook:", error);
      }
    };

    loadHook();
  }, []);

  if (useCustomHook === null) {
    return <div>Loading...</div>;
  }

  const result = useCustomHook();
  console.log(result);



  return (
    <div>      
      <div>Hook Result: {result.connected.toString()}</div>
    </div>
  );
};