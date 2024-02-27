require("dotenv").config();
const express = require("express");
const cors = require("cors");
// Import Moralis
const Moralis = require("moralis").default;
// Import the EvmChain dataType
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
const port = 3000;
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Add a variable for the api key, address and chain
const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/user-nfts", async (req, res) => {
  const { address, chain } = req.body;
  try {
    // Get and return the crypto data
    const data = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: chain,
      address: address,
    });
    res.status(200);
    res.json(data.result);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500);
    res.json({ error: error.message });
  }
});

app.post("/token-balances", async (req, res) => {
  const { tokenboundAccount, chain } = req.body;
  try {
    const data = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: chain,
      address: tokenboundAccount,
    });

    res.status(200);
    res.json(data.result);
  } catch (e) {
    console.error(e);
  }
});

// Add this a startServer function that initialises Moralis
const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

// Call startServer()
startServer();
