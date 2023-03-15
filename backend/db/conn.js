const mongoose = require('mongoose')

mongoose.set('strictQuery', false);

mongoose.connect(process.env.URI , {
    useNewUrlParser : true,
    useUnifiedTopology : true

}).then(()=>{
    console.log('Mongodb Connected')
    }).catch(()=>{
        console.log('Error connecting mongodb')
        })

const conn = mongoose.connection