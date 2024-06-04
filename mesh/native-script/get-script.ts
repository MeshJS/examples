import {
  NativeScript,
  resolveNativeScriptAddress,
  resolvePaymentKeyHash,
  resolveNativeScriptHex,
} from "@meshsdk/core";

export function getScript(walletAddress: string) {
  const hash = resolvePaymentKeyHash(walletAddress);

  const script: NativeScript = {
    type: "sig",
    keyHash: hash,
  };
  const scriptAddr = resolveNativeScriptAddress(script);

  let scriptHex = resolveNativeScriptHex(script);

  return { hash, script, scriptAddr, scriptHex };
}
