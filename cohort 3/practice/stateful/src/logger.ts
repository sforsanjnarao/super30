//at every 2 sec push the stateful data of backend in the database
import { gameManager } from '.'

export const logger=()=>{
    setInterval(()=>{
        gameManager.log()
    },3000)
}