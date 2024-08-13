import express from "express";

const app = express();
const port = 3000;

import { MeshWallet } from "@meshsdk/core";

app.get("/", (req, res) => {
  const wallet = new MeshWallet({
    networkId: 0,
    key: {
      type: "mnemonic",
      words: [
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
        "solution",
      ],
    },
  });

  const address = wallet.getChangeAddress();

  res.send(address);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
