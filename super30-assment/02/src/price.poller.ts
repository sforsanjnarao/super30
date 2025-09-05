import {WebSocket} from 'ws';
import {createClient} from 'redis'
import {Pool} from 'pg'

// const dataBase=new Pool({

// })

const url="wss://stream.binance.com:9443/stream?streams=btcusdt@aggTrade/ethusdt@aggTrade/solusdt@aggTrade";
const redis=createClient({url:"redis://localhost:6379"})

async function startServer() {
    await redis.connect()
}
startServer().catch(err=>console.error(err, 'the error'))


const ws= new WebSocket(url)

// interface incomingData{
//         data:string
// }

ws.on('connection',()=>{
    ws.on('open',()=>console.log('connection is open'))
   

    ws.on('message',async (event)=>{
        const data= await JSON.parse(event.toString())
        console.log(data)

        redis.publish('trade',
            JSON.stringify({
                asset:data.data.s,
                price:data.data.p,
                qty:data.data.q,
                timeStamp:data.data.t
            })
        )
    })

    ws.on('error',(err)=>{
        console.log('Error:', err)
    })

})
