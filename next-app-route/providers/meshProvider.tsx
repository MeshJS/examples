"use client";

import React, { useEffect, useState } from "react";

export const MeshProviderApp = ({ children }: { children: React.ReactNode }) => {
  const [MeshProviderState, setMeshProviderState] = useState<any | null>(null);
  useEffect(() => {
    const run = async () => {
        try {
            const { MeshProvider } = await import("@meshsdk/react");
            setMeshProviderState(() => MeshProvider);
          } catch (error) {
            console.error("Error importing MeshProvider:", error);
          }   
    };
    run();
  }, [setMeshProviderState]);

  if (MeshProviderState === null) {
    return <div>Loading...</div>
  }
  return <MeshProviderState>{children}</MeshProviderState>;
};
