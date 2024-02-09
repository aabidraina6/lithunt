const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const teamSchema = new mongoose.Schema({
  teamid: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false, // our dashboard
  },
  teamName: {
    type: String,
    required: false,
  },


  groupNo: {
    type: Number,
  },
  path: [
    {
      index: Number,
      location: Number,
      decrement : {type : Number , default : 0} ,
      coinUse : {type : Boolean , default : false} ,  
      sc1 : {type : Boolean , default : false} , 
      sc2 : {type : Boolean , default : false} ,
      flag : {type : Boolean , default : 0},
    },
  ],
  logs : [
    {
      time : {type : Date, required : true} , 
      location : {type : Number  , required : true}
    }

  ],
  current: {
    // visited last : index of that
    type: Number,
    default: 0,
  },

  countOfFails: { type: Number, default: 0 },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  tokens: [
    {
      token: String,
    },
  ],
  coins : {
    type : Number, 
    default : 5
  },
  showVote : {
    type : Boolean , 
    default : true
  },
  wrongLog : [
    {
      location : {type : Number , required : true}
    }
  ]
});

teamSchema.methods.generateJwt = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id, location: this.current },
      process.env.SECRET_KEY_APP
    );

    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const teamModel = mongoose.model("teamData", teamSchema);
module.exports = teamModel;
