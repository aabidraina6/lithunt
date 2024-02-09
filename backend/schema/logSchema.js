const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  logs: [
    {
      time: { type: Date, required: true },
      location: { type: Number, required: true },
      teamid: { type: String, required: true },
      valid: { type: Boolean, required: true },
    },
  ],
  winnerLogs: [
    {
      time: { type: Date, required: true },
      teamid: { type: String, required: true },
      isImposter : {type : Boolean , default : false}
    },
  ],
  removeLogs : [
    {
      time : {type : Date , required : true},
      teamid : {type : String , required : true} , 
      memberName : {type : String , required  : true},
      location : {type : String, required : true},
      isImposter : {type : Boolean , default : false}
    }
  ]
});

const logModel = mongoose.model("logData", logSchema);
module.exports = logModel;
