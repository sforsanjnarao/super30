import express from 'express'
import { inputOrderSchema } from './types'
import { orderbook } from './orderbook';
const app= express()
const BASE_ASSET = 'BTC' ;
const QUOTE_ASSET = 'USD';


app.use(express.json())


app.post('/api/v1/order',(req,res)=>{
    const order = inputOrderSchema.safeParse(req.body)
    if(!order.success){
        res.status(400).send(order.error.message)
        return
    }


    const {baseAsset, quoteAsset, price,quantity,  side, kind } =order.data
    //need to generate a unique if when ever endpoint hits
    const orderId=getOrderId()

    if(baseAsset !== BASE_ASSET || quoteAsset !== QUOTE_ASSET){
        res.status(400).send('Invalid base or quote asset');
        return;
    }




})

interface Fill {
    "price": number,
    "qty": number,
    "tradeId": number,
}

function getOrderId():string{
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2,15)
}

function fillOrder(orderId:string, price:number, quantity:number,side:"buy"| "sell",kind?: "ioc"):{status: "rejected" |"accepted", executedQty:number, fills: Fill[]}{
    let fills:Fill[]=[]
    const maxFillQuantity=getFillAmount(price, quantity, side)
    let executedQty=0

    if(kind=='ioc' && maxFillQuantity<quantity){
        return {status:'rejected',executedQty: maxFillQuantity, fills:[]}
    }


    if(side=='buy'){
        
    }

    return {
        status: 'accepted',
        executedQty,
        fills
    }

}


function getFillAmount(price:number, quantity:number, side:"buy"|"sell"):number{
    let filled=0

    if(side=='buy'){
        orderbook.asks.forEach((o)=>{
            if(o.price<price){
                filled+=Math.min(quantity, o.quantity)
            }
        })
    }else{
        orderbook.bids.forEach(o=>{
            if(o.price>price){
                filled+=Math.min(quantity,o.quantity)
            }
        })
    }
    return filled
}






app.listen(3000,()=>{
    console.log("server is running on port 3000 ")
})