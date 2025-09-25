import {Connection,clusterApiUrl, PublicKey, LAMPORTS_PER_SOL} from "@solana/web3.js"

const connect=new Connection(clusterApiUrl("devnet"))
console.log('connection is created with devnet')

//read balance from the network
const address=new PublicKey('BfMWref5BdoPLqifxCpDw5gmFCVoZvYNS9D7Ce5vqJBx')
const balance= await connect.getBalance(address)
const balanceInSol=balance / LAMPORTS_PER_SOL

console.log("alala",balanceInSol)
