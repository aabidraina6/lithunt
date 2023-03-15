const jwt = require("jsonwebtoken");
const teamModel = require("../schema/teamSchema");

const authenticate = async (req, res, next) => {
  try {
    const location = parseInt(req.params.location);
    if (!location) {
      res.status(409).json("location not found");
      return
    }
    const key = `jwt${location}`;
    const token = req.cookies[key];

    if (!token) {
      console.log("no token");
      res.status(403).json("invalid token");
      return;
    }

    const verifyToken = jwt.verify(token, process.env.SECRET_KEY_APP);
    const teamData = await teamModel.findOne({ _id: verifyToken._id });
    if (!teamData) {
      console.log("invalid token team not found");
      res.status(401).json("invalid token");
      return
    }
    req.token = token;
    req.team = teamData;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json("invalid token");
    return
  }
};

module.exports = { authenticate };
