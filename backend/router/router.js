const express = require("express");
const router = express.Router();
const { authAdmin } = require("../middleware/adminauth");
const { authenticate } = require("../middleware/authenticate");
const teamModel = require("../schema/teamSchema");
const clueModel = require("../schema/clueSchema");
const logModel = require("../schema/logSchema");

//todo :  remove page

const validLocations = [
  2619, 9261, 191142, 91412, 1426, 9162, 1629, 241191, 21419, 6241, 8, 88, 0,
  69, 4589,5
];

router.get("/api/team/:location", authenticate, async (req, res) => {
  try {
    res.status(200).json(req.team);
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/clue/:location", authenticate, async (req, res) => {
  try {
    const { location } = req.params;
    console.log(location);
    const clueData = await clueModel.findOne({ location });
    // console.log(clueData)
    if (!clueData) res.status(400).json({ error: "clue not found" });
    else res.status(200).json(clueData);
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/vote/:location", authenticate, async (req, res) => {
  res.status(200).json(req.team);
});

router.post("/api/remove/:teamid/:memberid", async (req, res) => {
  try {
    const { teamid, memberid } = req.params; // teamid : t10123 , memberid : _id
    const teamData = await teamModel.findOne({ teamid });
    if (!teamData) {
      console.log("team not found");
      res.status(400).json("team not found");
      return;
    }
    const logData = await logModel.findOne();
    if (teamData.path[teamData.current - 1].voted !== 0) {
      res.status(401).json({ error: "page not accessible" });
    }
    const index = teamData.teamMembers.findIndex((item) =>
      item._id.equals(memberid)
    );
    if (index > -1 && teamData.teamMembers[index].isImposter === true) {
      teamData.showVote = false;
    }

    const curr = new Date();
    const log = {
      time: curr,
      teamid: teamid,
      memberName: teamData.teamMembers[index].name,
      location: teamData.path[teamData.current - 1].location,
      isImposter: teamData.teamMembers[index].isImposter,
    };
    logData.removeLogs = logData.removeLogs.concat(log);
    await logData.save();

    var removed = teamData.teamMembers[index];
    removed = {
      name: removed.name,
      email: removed.email,
      isImposter: removed.isImposter,
      at: teamData.path[teamData.current - 1].location,
    };

    teamData.removedMembers = teamData.removedMembers.concat(removed);
    teamData.teamMembers.splice(index, 1);
    teamData.path[teamData.current - 1].voted =
      teamData.path[teamData.current - 1].voted + 1;
    await teamData.save();
    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
});

router.post("/api/login/:location/", async (req, res) => {
  try {

    var { location } = req.params; // number assigned to that location
    location = parseInt(location);
    if (validLocations.includes(location) === false) {
      res.status(404).json("invalid location");
      return;
    }
    const { teamid, password } = req.body;
    if (!teamid || !password) {
      console.log("invalid details");
      res.status(401).json("invalid details");
      return;
    }
    const teamData = await teamModel.findOne({ teamid });
    if (teamData && teamData.isBlocked) {
      res.status(405).json("blocked");
      return;
    }

    if (!teamData) {
      console.log("team not found");
      res.status(401).json("team not found");
    } else {
      if (!(password === teamData.password)) {
        console.log("wrong credentials");
        res.status(401).json({ message: "wrong cred" });
      } else {
        if (teamData.isAdmin) {
          const token = await teamData.generateJwt();

          res.cookie("jwtAdminToken", token, {});
          res.status(203).json("admin login");
          return;
        }
        const location_index_current = teamData.current;
        const location_num = teamData.path.find(
          (key) => key.location === location
        );

        if(location === 5){
          res.status(211).json('fake');
          return ;
        }
        //log the entries

        if (location_num.index <= location_index_current + 1) {
          if (!location_num.index) {
            res.status(404).json({ error: "wrong url" });
          }
          console.log("ok");
          const logTemp = await logModel.findOne();
          if (!logTemp) {
            const log = new logModel({
              logs: [],
              winnerLogs: [],
            });
            await log.save();
          }
          if (location_num.index === location_index_current + 1)
            teamData.current = teamData.current + 1;
          if (
            teamData.logs.findIndex((item) => item.location === location) === -1
          ) {
            const logData = await logModel.findOne();
            const curr = new Date();
            teamData.countOfFails = 0;
            teamData.logs = teamData.logs.concat({
              time: curr,
              location: location,
            });

            if (teamData.logs.length === teamData.path.length) {
              console.log("winner");
              logData.logs = logData.logs.concat({
                time: curr,
                location: location,
                teamid: teamData.teamid,
                valid: true,
              });
              await logData.save();
              res.status(202).json("congrats on winning");
              return;
            }
            logData.logs = logData.logs.concat({
              time: curr,
              location: location,
              teamid: teamData.teamid,
              valid: true,
            });
            await logData.save();
          }
          teamData.wrongLog.splice(0, teamData.wrongLog.length);
          await teamData.save();
          const token = await teamData.generateJwt();
          res.cookie(`jwt${location}`, token, {
            httpOnly: true,
          });
          res.status(200).json(teamData);
        } else {
          const logTemp = await logModel.findOne();
          if (!logTemp) {
            const log = new logModel({
              logs: [],
              winnerLogs: [],
            });
            await log.save();
          }
          const logData = await logModel.findOne();

          if (
            teamData.wrongLog.findIndex(
              (item) => item.location === parseInt(location)
            ) === -1
          ) {
            console.log("inside");
            teamData.wrongLog = teamData.wrongLog.concat({
              location: location,
            });
            teamData.countOfFails = teamData.countOfFails + 1;
            const curr = new Date();
            logData.logs = logData.logs.concat({
              time: curr,
              location: location,
              teamid: teamData.teamid,
              valid: false,
            });
          }
          await logData.save();
          if (teamData.countOfFails === 3) teamData.isBlocked = true;
          await teamData.save();

          console.log("location wrong");
          res.status(400).json(teamData);
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(409).json("error in login");
  }
});

router.post("/api/register", async (req, res) => {
  try {
    const { teamid, password, teamName, teamMembers, groupNo, path } = req.body;
    const exists = await teamModel.findOne({ teamid });
    if (exists) {
      res.status(409).json({ error: "team already added" });
    } else {
      const teamData = new teamModel({
        teamid,
        password,
        teamName,
        teamMembers,
        groupNo,
        path,
      });
      console.log(teamMembers);
      await teamData.save();
      res.status(201).json({ message: "team registered successfully" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});

router.post("/api/addclue", async (req, res) => {
  try {
    const { index, location, text } = req.body;
    const clueData = new clueModel({ index, location, text });
    await clueData.save();
    res.status(200).json({ message: "clue saved successfully" });
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/admin", authAdmin, async (req, res) => {
  try {
    const logData = await logModel.findOne();
    res.status(200).json(logData);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
