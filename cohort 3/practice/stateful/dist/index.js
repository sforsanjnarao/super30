"use strict";
// import {WebSocket, WebSocketServer} from 'ws'
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameManager = void 0;
const logger_1 = require("./logger");
const store_1 = require("./store");
exports.gameManager = new store_1.GameManager();
(0, logger_1.logger)();
setInterval(() => {
    exports.gameManager.addGame(Math.random().toString());
}, 1000);
