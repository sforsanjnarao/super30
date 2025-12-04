"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
// export const Game:Game[]=[]
class GameManager {
    constructor() {
        this.games = [];
        this.games = [];
    }
    //putting the move on given gameId
    addMove(gameId, move) {
        const game = this.games.find(game => game.id == gameId);
        game === null || game === void 0 ? void 0 : game.moves.push(move);
    }
    addGame(gameId) {
        const game = {
            id: gameId,
            whitePlayer: 'sura',
            blackPlayer: 'yash',
            moves: []
        };
        this.games.push(game);
    }
    log() {
        console.log(this.games);
    }
}
exports.GameManager = GameManager;
