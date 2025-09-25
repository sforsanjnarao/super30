import axios from 'axios'

// async function getQuote() {
       
//         const amount = 10000;
//         const inputMint = "So11111111111111111111111111111111111111112";
//         const outputMint = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
    
//         const url = `https://quote-api.jup.ag/v1/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}`;
    
//         let config = {
//             method: 'get',
//             maxBodyLength: Infinity,
//             url: url,
//             headers: { 
//               'Accept': 'application/json'
//             }
//         }
//         const res= axios.request(config)
//         .then((response) => {
//           console.log(JSON.stringify(response.data));
//         })
//         .catch((error) => {
//           console.log(error);
        
//         })
//         console.log("Best route:", JSON.stringify(res,null, 2));
    
     
// }
// getQuote()



// let config = {
//   method: 'get',
//   maxBodyLength: Infinity,
//   url: 'https://lite-api.jup.ag/swap/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v&amount=1000',
//   headers: { 
//     'Accept': 'application/json'
//   }
// };

// axios.request(config)
// .then((response) => {
//   console.log(JSON.stringify(response.data));
// })
// .catch((error) => {
//   console.log(error);
// })


let data = JSON.stringify({
  "userPublicKey": "3Zs6oEQYwYN6kmeerHsfTLV1xqxMQM2NyK94W8Tad5tA",
  "quoteResponse": {
    "inputMint": "So11111111111111111111111111111111111111112",
    "inAmount": "1000000",
    "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    "outAmount": "125630",
    "otherAmountThreshold": "125002",
    "swapMode": "ExactIn",
    "slippageBps": 50,
    "platformFee": null,
    "priceImpactPct": "0",
    "routePlan": [
      {
        "swapInfo": {
          "ammKey": "AvBSC1KmFNceHpD6jyyXBV6gMXFxZ8BJJ3HVUN8kCurJ",
          "label": "Obric V2",
          "inputMint": "So11111111111111111111111111111111111111112",
          "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "inAmount": "1000000",
          "outAmount": "125630",
          "feeAmount": "5",
          "feeMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
        },
        "percent": 100
      }
    ]
  },
  "prioritizationFeeLamports": {
    "priorityLevelWithMaxLamports": {
      "maxLamports": 10000000,
      "priorityLevel": "veryHigh"
    }
  },
  "dynamicComputeUnitLimit": true
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://lite-api.jup.ag/swap/v1/swap',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data.outAmount));
})
.catch((error) => {
  console.log(error);
});