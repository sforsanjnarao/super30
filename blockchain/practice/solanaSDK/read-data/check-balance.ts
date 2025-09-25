import {Connection, PublicKey, LAMPORTS_PER_SOL} from "@solana/web3.js"


const inputAddress=process.argv[2]

const connect=new Connection("https://api.mainnet-beta.solana.com","confirmed")
// const address= new PublicKey("")
// const balance= await connect.getBalance(address)

const address= new PublicKey(inputAddress)
const balance= await connect.getBalance(address)

const balanceInSol=balance/LAMPORTS_PER_SOL
console.log(balanceInSol)