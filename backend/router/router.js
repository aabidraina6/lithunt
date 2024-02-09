const express = require("express");
const router = express.Router();
const { authAdmin } = require("../middleware/adminauth");
const { authenticate } = require("../middleware/authenticate");
const teamModel = require("../schema/teamSchema");
const clueModel = require("../schema/clueSchema");
const logModel = require("../schema/logSchema");


const validLocations = [
  2619, 9261, 191142, 91412, 1426, 9162, 1629, 241191, 21419, 6241, 8, 4589, 5, , 20
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
    const teamData = req.team;
    const index = teamData.path.findIndex(
      (item) => item.location === parseInt(location)
    );
    // if (index >= 10) {
    //   throw new Error("Not supp ro be here");
    // }
    const newLocation = teamData.path[index + 1].location;
    console.log(newLocation);
    const clueData = await clueModel.findOne({ location: newLocation });
    console.log(clueData);
    var newData = clueData;
    var ind = parseInt(teamData.teamid[teamData.teamid.length - 1])
    ind += teamData.current
    ind  %= 10
    newData.wrong = newData.wrong[ind]


    if (!newData) res.status(400).json({ error: "clue not found" });
    else res.status(200).json(newData);
  } catch (err) {
    console.log(err);
    res.status(400).json("clue error");
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
    console.log(memberid, index, teamData.teamMembers[index]);
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
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(400).json();
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

        if (location === 5) {
          res.status(211).json("fake"); 
          return;
        }
        //log the entries

        if (location_num.index <= location_index_current + 1) {
          if (!location_num.index) {
            res.status(404).json({ error: "wrong url" });
          } 
          console.log("ok ", teamData.current, teamData.path.length);

          const logTemp = await logModel.findOne();
          if (!logTemp) {
            const log = new logModel({
              logs: [],
              winnerLogs: [],
            });
            await log.save();
          }
          if (location_num.index === location_index_current + 1) {
            console.log("hrer");
            if (
              location_index_current > 0 &&
              teamData.path[location_index_current].decrement && 
              !teamData.path[location_index_current].coinUse
            ) {
              teamData.coins -= 1;
              teamData.path[location_index_current].coinUse = true; //! logs in mul at same location
              if (
                teamData.coins == 0 &&
                teamData.current !== teamData.path.length - 1
              ) {
                teamData.isBlocked = true;
                res.status(406).json("coins over");
                await teamData.save();
                await log.save();
                return;
                //! res.status
              }
            }
            teamData.current = teamData.current + 1;
          }
          console.log("ni ", teamData.path.length, location);

          if (
            teamData.logs.findIndex((item) => item.location === location) ===
              -1 ||
            teamData.current === teamData.path.length - 1
          ) {
            const logData = await logModel.findOne();
            const curr = new Date();
            teamData.logs = teamData.logs.concat({
              time: curr,
              location: location,
            });
            if (teamData.current === teamData.path.length - 1) {
              console.log("winner");
              if (
                teamData.logs.findIndex(
                  (item) => item.location === location
                ) === -1
              ) {
                logData.logs = logData.logs.concat({
                  time: curr,
                  location: location,
                  teamid: teamData.teamid,
                  valid: true,
                });
                await logData.save();
              }
              const token = await teamData.generateJwt();
              console.log(`jwt${location}`)
              res.cookie(`jwt${location}`, token, {
                httpOnly: true,
              });
              // await teamData.save()
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
          if (teamData.countOfFails === 5) teamData.isBlocked = true; // todo  : update to 5
          await teamData.save();

          console.log("location wrong");
          res.status(400).json(teamData);
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(410).json("error in login");
  }
});

router.post("/api/setCoin/:teamid", async (req, res) => {
  try {
    var { teamid } = req.params;
    console.log(teamid);
    // console.log( teamid.teamid)
    if (!teamid) {
      res.status(404).json("invalid teamid");
      return;
    }
    const team = await teamModel.findOne({ teamid: teamid });
    if (!team) {
      res.status(401).json("team not found");
      return;
    }
    const ind = team.current;
    console.log("here", ind);
    team.path[ind].decrement = true;

    await team.save();
    res.status(200).json("updated");
  } catch (e) {
    // console.log("error ", e);
    res.status(400).json();
  }
});

router.post(
  "/api/setScratch/:index/:location",
  authenticate,
  async (req, res) => {
    try {
      const { index, location } = req.params;
      const teamData = req.team;
      const curr = teamData.current;
      if (index == 1) {
        teamData.path[curr].sc1 = true;
      } else {
        teamData.path[curr].sc2 = true;
      }
      await teamData.save();
      res.status(200).json(`sc added success ${index}`);
    } catch (e) {
      console.log(e);
      res.status(400).json("error in setScratch");
    }
  }
);

// router.post('/api/addScratch/:teamid')

router.post("/api/register", async (req, res) => {
  try {
    const { teamid, password, teamName, teamMembers, groupNo, path } = req.body;
    const exists = await teamModel.findOne({ teamid });
    if(exists){
      console.log("team already added");
      res.status(400).json({ message: `team already added ${teamid}` })
      return;
    }
    teamModel.insertMany(req.body);
    console.log("team registered successfully")
    res.status(201).json({ message: `teams registered successfully ${teamid}` });
    return;
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
    const { index, location, right, wrong } = req.body;
    const clueData = new clueModel({ index, location, right, wrong });
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
