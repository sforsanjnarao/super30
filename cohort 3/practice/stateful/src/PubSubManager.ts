export class PubSubManager{
    private static instance:PubSubManager

    constructor(){

    }


    public static getInstance():PubSubManager{
        if(!PubSubManager.instance){
            PubSubManager.instance= new PubSubManager()
            return PubSubManager.instance
        }
        return PubSubManager.instance
    }


    addUserToStock(userId:string, stockTicker:string){

    }

    removeUserFromStock(userId:string, stockTicker:string){

    }

    forwardMessageToUser(userId:string, stockTicker:string, message:string){

    }
}