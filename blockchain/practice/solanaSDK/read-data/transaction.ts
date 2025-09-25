import {Transaction, LAMPORTS_PER_SOL, SystemProgram, PublicKey,sendAndConfirmTransaction,Connection, Keypair} from "@solana/web3.js"
import { generateKeyPair } from "crypto"

const connection=new Connection("https://api.mainet-beta.solana.com", "confirmed")

const senderkeypair= Keypair.generate()
//or



const sender=new PublicKey(process.argv[1])
const reciver=new PublicKey(process.argv[2])
const amount=2
const transaction= new Transaction()

const sendSolInstrection=SystemProgram.transfer({
    fromPubkey: sender,
    toPubkey: reciver,
    lamports:LAMPORTS_PER_SOL * amount
})

transaction.add(sendSolInstrection)


const signature= sendAndConfirmTransaction(connection, transaction,[

])