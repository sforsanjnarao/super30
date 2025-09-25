import {address, createKeyPairSignerFromBytes, getBase58Encoder, getComputeUnitEstimateForTransactionMessageFactory} from '@solana/web3.js'
import {createSolanaRpc, createSolanaRpcSubscriptions, sendAndConfirmTransactionFactory} from '@solana/web3.js'
import { lamports } from '@solana/web3.js'
import {getTransferSolInstruction} from '@solana-program/system'

import {pipe, createTransactionMessage, setTransactionMessageFeePayer, setTransactionMessageLifetimeUsingBlockhash, appendTransactionMessageInstruction} from '@solana/web3.js'

import {signTransactionMessageWithSigners} from "@solana/web3.js"
import {getBase64EncodedWireTransaction} from "@solana/web3.js"
import { getSetComputeUnitLimitInstruction, getSetComputeUnitPriceInstruction } from "@solana-program/compute-budget";
import { getSignatureFromTransaction } from '@solana/web3.js'

//defining transfer addresses
const reciverAddres=address('reciver-public-key')
const privateKey="your-privateKey"
const sourceKeypair =await createKeyPairSignerFromBytes(getBase58Encoder().encode(privateKey))


//rpc connection
const rpc_url=""
const wss_url=""

const rpc= createSolanaRpc(rpc_url)
const rpcWebsocket=createSolanaRpcSubscriptions(wss_url);

const sendAndConfirmTransaction=sendAndConfirmTransactionFactory({
    rpc,
    rpcWebsocket
})

//create a transferInstruction
const {value: LatestBlockhash} = await rpc.getLatestBlockhash().send()


const instruction= getTransferSolInstruction({
    amount: lamports(1n),
    destination: reciverAddres,
    source: sourceKeypair
})

//create transaction message
const transactionMessage=pipe(
    createTransactionMessage({version:0}),
    (message)=> setTransactionMessageFeePayer(sourceKeypair.address,message),
    (message)=>setTransactionMessageLifetimeUsingBlockhash(LatestBlockhash,message),
    (message)=>appendTransactionMessageInstruction(instruction,message)
)

console.log("Transaction message created")

//sign the transation 

const signedTransation= await signTransactionMessageWithSigners(transactionMessage)
console.log("Transaction signed");


//get priority fee from signed transation

const base64EncodeWireTransaction=getBase64EncodedWireTransaction(signedTransation)

const response= await fetch(rpc_url,{
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
        jsonrpc:"2.0",
        id:"helius-example",
        method:"getPriorityFeeEstimate",
        params:[
            {
                transation: base64EncodeWireTransaction,
                option:{
                    transationEncoding:"base64",
                    priorityLevel: "High"
                }
            }
        ]
    })
});
const {result}=await response.json()
const priorityFee=result.priorityFeeEstimate
console.log("Setting priority fee to ", priorityFee);


//optimize Compute Units

const getComputeUnitEstimateForTransactionMessage=getComputeUnitEstimateForTransactionMessageFactory({
    rpc
})

let computeUnitsEstimate= await getComputeUnitEstimateForTransactionMessage(transactionMessage)
computeUnitsEstimate=computeUnitsEstimate<1000 ? 1000 : Math.ceil(computeUnitsEstimate *1.1);
console.log("Setting compute units to ", computeUnitsEstimate);


//REBUILD AND SIGN FINAL TRANSACTION
const {value: finalLatestBlockhash}=await rpc.getLatestBlockhash().send()

const finalTransactionMessage=appendTransactionMessageInstruction(
    [
        getSetComputeUnitPriceInstruction({microLamports:priorityFee}),
        getSetComputeUnitLimitInstruction({units: computeUnitsEstimate})
    ],
    transactionMessage,
)

setTransactionMessageLifetimeUsingBlockhash(finalLatestBlockhash,finalTransactionMessage)
const finalSignedTransaction= await signTransactionMessageWithSigners(finalTransactionMessage)

console.log("Rebuilt the transaction and signed it");


//SEND AND CONFIRM THE FINAL TRANSACTION

console.log("Sending and confirming transaction");
await sendAndConfirmTransaction(finalSignedTransaction,{
    commitment:"confirmed",
    maxRetries: 0n,
    skipPreflight: true,
})
console.log("Transfer confirmed: ", getSignatureFromTransaction(finalSignedTransaction));
//to run this work u need to run tirminal with this command
//npx esrun sendTransaction.ts 