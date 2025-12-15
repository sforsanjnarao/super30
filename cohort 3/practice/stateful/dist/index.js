"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PubSubManager_1 = require("./PubSubManager");
setInterval(() => {
    PubSubManager_1.PubSubManager.getInstance().Subscriber(Math.random().toString(), 'apple');
}, 3000);
