const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000; // ✅ Ensure Render detects the port

app.use(cors());

app.get("/", (req, res) => {
    res.send("Crypto Arbitrage API is running!");
});

const exchanges = {
    binance: "https://api.binance.com/api/v3/ticker/price?symbol=",
    kucoin: "https://api.kucoin.com/api/v1/market/orderbook/level1?symbol="
};

const pairs = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT"];

app.get("/prices", async (req, res) => {
    try {
        let results = [];
        for (let pair of pairs) {
            const binanceRes = await axios.get(exchanges.binance + pair);
            const kucoinRes = await axios.get(exchanges.kucoin + pair);

            results.push({
                pair,
                binance: parseFloat(binanceRes.data.price),
                kucoin: parseFloat(kucoinRes.data.data.price),
            });
        }
        res.json(results);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

// ✅ Make sure Render detects the port
app.listen(PORT, () => console.log(Server running on port ${PORT}));
