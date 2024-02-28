require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require('axios'); // Add axios requirement here
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173"] }));

const MORALIS_API_KEY = process.env.MORALIS_API_KEY;

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.get('/getPoints', async (req, res) => {
    const { address } = req.query;

    if (!address) {
        return res.status(400).send('Address parameter is required');
    }

    // Define all your API endpoints with labels
    const apiEndpoints = [
        { label: 'etherfi', url: `https://www.restaking.city/api/points/etherfi?address=${address}` },
        { label: 'renzo', url: `https://www.restaking.city/api/points/renzo?address=${address}` },
        { label: 'kelpdao', url: `https://www.restaking.city/api/points/kelpdao?address=${address}` },
        { label: 'claystack', url: `https://www.restaking.city/api/points/claystack?address=${address}` },
        { label: 'origin', url: `https://www.restaking.city/api/points/origin?address=${address}` },
        { label: 'swell', url: `https://www.restaking.city/api/points/swell?address=${address}` }
    ];

    try {
        // Use axios to make all requests concurrently
        const apiRequests = apiEndpoints.map(endpoint => axios.get(endpoint.url).then(response => ({
            label: endpoint.label,
            data: {
                elPoints: response.data.elPoints,
                points: response.data.points
            }
        })).catch(error => {
            console.error(`Failed to fetch data from ${endpoint.url}`, error);
            // Return a placeholder in case of error, including the label
            return { label: endpoint.label, data: { error: 'Failed to fetch data', url: endpoint.url } };
        }));
        const responses = await Promise.all(apiRequests);

        // Extract only the elPoints and points from all responses, including the label
        const results = responses.map(response => ({
            platform: response.label,
            ...response.data
        }));

        // Send aggregated results
        res.send({ address, results });
    } catch (error) {
        console.error('Error fetching points:', error);
        res.status(500).send('Failed to fetch points from APIs');
    }
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
  console.log("🚀 ~ app.post ~ tokenboundAccount:", tokenboundAccount);
  try {
    const data = await Moralis.EvmApi.token.getWalletTokenBalances({
      chain: chain,
      address: tokenboundAccount,
    });

    res.status(200);
    res.json(data.jsonResponse);
  } catch (e) {
    console.error(e);
  }
});

app.post("/get-metadata", async (req, res) => {
  const { chain, addresses } = req.body;
  try {
    const response = await Moralis.EvmApi.token.getTokenMetadata({
      chain: chain,
      addresses: addresses,
    });

    console.log(response.raw);
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
