const mongoose = require("mongoose");

const clueSchema = new mongoose.Schema({
    index : {
        type : Number , 
        required : true
    } , 
    location : {
        type : Number , 
        required : true
    } , 
    wrong : [{
        type : String , 
        required : true
    }], 
    right : {
        type : String , 
        required : true
    }

})



const clueModel = mongoose.model('clueData' , clueSchema)
module.exports  = clueModel