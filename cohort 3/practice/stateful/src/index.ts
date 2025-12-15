import {PubSubManager} from './PubSubManager'


setInterval(()=>{
    PubSubManager.getInstance().Subscriber(Math.random().toString(),'apple')
},3000)