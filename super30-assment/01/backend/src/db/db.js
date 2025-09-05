const mongoose= require('mongoose')

const connect=()=>{
    mongoose.connect('')
    .then(()=>{
        console.log('db connected..')
    })
    .catch((err)=>{
        console.error('ERROR:', err)
    })
}
module.exports=connect