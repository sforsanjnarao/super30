


interface Game{
    id:string,
    whitePlayer:string,
    blackPlayer:string
    moves:string[]
}


// export const Game:Game[]=[]

export class GameManager{
    // games:Game[]=[]
    games: Map<string,Game>

    constructor(){
        // this.games=[]
        this.games= new Map
    }

    //putting the move on given gameId
    addMove(gameId:string, move:string){
        // const game=this.games.find(game=>game.id==gameId)
        const game=this.games.get(gameId)
        game?.moves.push(move)
    }

    addGame(gameId: string){
        const game:Game={
            id:gameId,
            whitePlayer:'sura',
            blackPlayer:'yash',
            moves:[]
        }
        this.games.set(gameId, game)
    }

    log(){
        console.log(this.games)
    }


}