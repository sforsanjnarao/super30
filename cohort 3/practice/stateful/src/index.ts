// import {WebSocket, WebSocketServer} from 'ws'

import { logger } from "./logger";
import {  GameManager } from "./store";
export const gameManager = new GameManager()




logger()


setInterval(()=>{
    gameManager.addGame(Math.random().toString())
},1000)