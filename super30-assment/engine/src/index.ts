import { createClient } from "redis";

const client = createClient();
await client.connect();

type StreamMessage = {
    id: string;
    message: Record<string, string>;
  };
  
  type StreamResponse = {
    name: string;
    messages: StreamMessage[];
  };

let lastId = "0";

let balances: Record<string, { [asset: string]: number }> = {
    user1: { USD: 200000, BTC: 0 }, // example initial balance
  };
  
let open_orders: any[] = [];
  
let prices: Record<string, number> = {};
async function consume() {
    while (true) {
      const res = await client.xRead(
        [{ key: "ticker-data", id: lastId }],
        { BLOCK: 0, COUNT: 10 }
      );
  
      if (!res) continue;
  
      for (const stream of res as StreamResponse[]) {
        for (const message of stream.messages) {
          lastId = message.id;
          const data = message.message;
  
          if (data.price && data.asset) {
            // 📈 Price update
            prices[data.asset] = parseFloat(data.price);
            console.log("Updated price:", data.asset, prices[data.asset]);
  
            // Recalculate PnL for open orders
            for (let order of open_orders) {
              if (order.asset === data.asset) {
                const currentPrice = prices[data.asset];
                const pnl =
                  order.type === "long"
                    ? ((currentPrice ?? 0) - order.entryPrice) * order.leverage
                    : (order.entryPrice - (currentPrice ?? 0)) * order.leverage;
  
                order.pnl = pnl;
                // TODO: margin call / auto-close logic
              }
            }
          } else if (data.type && data.asset) {
            // 📝 Trade create message
            const user = "user1"; // later you’ll tie this to real user from JWT
            const margin = parseFloat(data.margin ?? "0");
            const leverage = parseFloat(data.leverage ?? "0");
  
            // Check balance
            if ((balances[user]?.USD || 0) < margin) {
              console.log("❌ Insufficient balance");
              continue;
            }
  
            // Deduct margin
            balances[user] = balances[user] ?? { USD: 0 }; // Ensure user balance exists
            balances[user].USD = (balances[user].USD ?? 0) - margin;
  
            // Create order
            const entryPrice = prices[data.asset] || 0;
            open_orders.push({
              id: data.id,
              user,
              asset: data.asset,
              type: data.type,
              margin,
              leverage,
              entryPrice,
              pnl: 0,
            });
  
            console.log("✅ Order created:", open_orders[open_orders.length - 1]);
          }
        }
      }
    }
  }
  
  consume().catch(console.error);


