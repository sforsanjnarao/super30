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
while (1){
    const res=await client.xRead(
        [{ key: "ticker-data", id: '$' }],
        { BLOCK: 0, COUNT: 10 }
      );
    
    if (res) {
        for (const stream of res as StreamResponse[]) {
          for (const message of stream.messages) {

            console.log("Message ID:", message.id);
            console.log("Asset:", message.message.asset);
         
            console.log("Price:", message.message.price);
    
            lastId = message.id; // update checkpoint
          }
        }
      }

}

//we have some set of data we need to update one Price, open-order and balance
//with the use we need to sent the user's balance too

//this is what we are processing here

