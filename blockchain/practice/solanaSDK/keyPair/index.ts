import {Keypair} from "@solana/web3.js"
import "dotenv/config";
import {getKeypairFromEnvironment} from "@solana-developers/helpers"

// const keypair= Keypair.generate();

const privateKey=getKeypairFromEnvironment('PRIVATE_KEY')
// console.log("public key: ",keypair.publicKey.toBase58())
// console.log("private key: ", keypair.secretKey)
console.log(privateKey)