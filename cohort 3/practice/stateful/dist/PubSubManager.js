"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PubSubManager = void 0;
const redis_1 = require("redis");
class PubSubManager {
    constructor() {
        this.redisClient = (0, redis_1.createClient)();
        this.redisClient.connect();
        this.subscriptions = new Map();
    }
    static getInstance() {
        if (!PubSubManager.instance) {
            PubSubManager.instance = new PubSubManager();
        }
        return PubSubManager.instance;
    }
    // public async Publisher( channel:string, message:string){
    //     await this.redisClient.publish(channel,message)
    //     console.log(`this message: ${message} published on this channel: ${channel}`)
    // }
    Subscriber(userId, channel) {
        var _a, _b;
        if (!this.subscriptions.has(channel)) {
            console.log(`subscribe to this channel ${channel}`);
            this.subscriptions.set(channel, []);
        }
        (_a = this.subscriptions.get(channel)) === null || _a === void 0 ? void 0 : _a.push(userId);
        console.log(`pushed the userId ${userId} in the channel: ${channel}`);
        if (((_b = this.subscriptions.get(channel)) === null || _b === void 0 ? void 0 : _b.length) === 1) {
            this.redisClient.subscribe(channel, (message) => {
                this.handleMessage(channel, message);
            });
        }
        console.log(`all members in channel [${this.subscriptions.get(channel)}]`);
    }
    userUnSubscribe(userId, channel) {
        var _a, _b;
        this.subscriptions.set(channel, ((_a = this.subscriptions.get(channel)) === null || _a === void 0 ? void 0 : _a.filter((sub) => sub !== userId)) || []);
        if (((_b = this.subscriptions.get(channel)) === null || _b === void 0 ? void 0 : _b.length) === 0) {
            this.redisClient.unsubscribe(channel);
            console.log(`UnSubscribed to Redis channel: ${channel}`);
        }
    }
    handleMessage(channel, message) {
        var _a;
        (_a = this.subscriptions.get(channel)) === null || _a === void 0 ? void 0 : _a.forEach((sub) => {
            console.log('message received from the', sub);
        });
    }
    redisDisconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redisClient.quit();
        });
    }
}
exports.PubSubManager = PubSubManager;
