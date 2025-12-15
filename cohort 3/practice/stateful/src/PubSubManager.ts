import { createClient, RedisClientType } from 'redis';

export class PubSubManager {
    private static instance: PubSubManager;
    private redisClient: RedisClientType;
    private subscriptions: Map<string, string[]>;

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
        this.subscriptions = new Map();
        

    }

    public static getInstance():PubSubManager{
        if(!PubSubManager.instance){
            PubSubManager.instance=new PubSubManager()
        }
        return PubSubManager.instance
    }

    // public async Publisher( channel:string, message:string){
    //     await this.redisClient.publish(channel,message)
    //     console.log(`this message: ${message} published on this channel: ${channel}`)
    // }

    public Subscriber(userId:string, channel:string){
            if(!this.subscriptions.has(channel)){
                console.log(`subscribe to this channel ${channel}`)
                this.subscriptions.set(channel,[])
            }
            this.subscriptions.get(channel)?.push(userId)
            console.log(`pushed the userId ${userId} in the channel: ${channel}`)

            if(this.subscriptions.get(channel)?.length===1){
                this.redisClient.subscribe(channel,(message)=>{
                        this.handleMessage(channel,message)
                })
            }
            console.log(`all members in channel [${this.subscriptions.get(channel)}]`)
    }


    public userUnSubscribe(userId: string, channel: string) {
        this.subscriptions.set(channel, this.subscriptions.get(channel)?.filter((sub)=>sub !== userId)||[])

        if(this.subscriptions.get(channel)?.length===0){
            this.redisClient.unsubscribe(channel)
            console.log(`UnSubscribed to Redis channel: ${channel}`);

        }
    }

    private handleMessage(channel:string, message:string){
        this.subscriptions.get(channel)?.forEach((sub)=>{
            console.log('message received from the', sub)
        })
    }

    public async redisDisconnect(){
        await this.redisClient.quit()
    }
}

