"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
//at every 2 sec push the stateful data of backend in the database
const _1 = require(".");
const logger = () => {
    setInterval(() => {
        _1.gameManager.log();
    }, 3000);
};
exports.logger = logger;
