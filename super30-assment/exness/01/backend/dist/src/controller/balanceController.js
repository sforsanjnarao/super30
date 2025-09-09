// Mock balances (later engine will update these)
let balances = {
    USD: { balance: 200000, decimals: 2 },
    BTC: { balance: 10000000, decimals: 4 },
};
const supportedAssets = [
    {
        symbol: "BTC",
        name: "Bitcoin",
        // imageUrl: "https://image.com/png",
    },
    {
        symbol: "ETH",
        name: "Ethereum",
    },
];
const getBalanceUsd = (req, res) => {
    res.json({ balance: balances.USD.balance });
};
const getBalance = (req, res) => {
    const response = {};
    for (const [symbol, data] of Object.entries(balances)) {
        if (symbol !== "USD") {
            response[symbol] = data;
        }
    }
    res.json(response);
};
const getSupportedAssets = (req, res) => {
    res.json({ assets: supportedAssets });
};
export { getBalanceUsd, getBalance, getSupportedAssets, balances };
//# sourceMappingURL=balanceController.js.map