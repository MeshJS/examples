import { BlockfrostProvider } from "@meshsdk/core";
import { blockfrost_api_key } from "./configs";

export function getProvider() {
  return new BlockfrostProvider(blockfrost_api_key);
}
