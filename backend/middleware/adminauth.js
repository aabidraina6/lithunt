const jwt = require("jsonwebtoken");
const teamModel = require("../schema/teamSchema");

const authAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwtAdminToken;
    if (!token) {
      res.status(401).json("no token found");
      return;
    }
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY_APP);
    const teamData = await teamModel.findOne({ _id: verifyToken._id });
    if (!teamData) {
      console.log("admin not found");
      res.status(401).json("invalid admin");
      return;
    }
    req.team = teamData;
    next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { authAdmin };
