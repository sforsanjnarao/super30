interface Order{
    price: number;
    quantity: number;
    orderId:number;
}


interface Ask extends Order{ //sell order
    side:'ask';
}


interface Bid extends Order{ //buy order
    side:'bid'
}
interface orderBook{
    asks:Ask[],
    bids:Bid[]
}

//example
// const orderBook: orderBook = {
//     asks: [
//         { price: 101, quantity: 10, orderId: 1, side: 'ask' }
//     ],
//     bids: [
//         { price: 99, quantity: 5, orderId: 2, side: 'bid' }
//     ]
// }

export const orderbook: orderBook={
    asks:[],
    bids:[]
}


export const bookWithQuantity: {
    bids: {[price: number]: number}; 
    asks: {[price: number]: number}
} = {
    bids: {},
    asks: {}
}

// bids: {
//   100: 5,
//   99: 3
// }

// asks: {
//   102: 7,
//   103: 12
// }