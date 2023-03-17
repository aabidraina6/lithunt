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
    required: true,
  },
  teamMembers: [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      isImposter: { type: Boolean, default: false },
    },
  ],
  removedMembers : [
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      isImposter: { type: Boolean, default: false },
      at : {type :Number , required : true}
    }
  ],
  groupNo: {
    type: Number,
  },
  path: [
    {
      index: Number,
      location: Number,
      voted: { type: Number, default: -1 },
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
