import * as express from "express";
import { UIDLEntry } from "../models/sequelize";
const router = express.Router();
const authenticate = require("../controllers/authorization");

// GET ALL UIDL NAMES THAT THE USER HAS
router.get("/:userid", authenticate, async (req, res) => {
  const entryNames = await UIDLEntry.findAll({
    attributes: ["EntryName"],
    where: {
      UserUserId: req.params.userid
    }
  });

  if (entryNames) {
    return res.status(200).send({
      success: entryNames.map(entry => entry.EntryName)
    });
  }
  return res.status(400).send({
    error: "Did not find any entries"
  });
});

// GET SPECIFIC UIDL FOR USER BY ITS NAME
router.get("/:userid/:entryname", authenticate, async (req, res) => {
  const { userid, entryname } = req.params;

  const isFound = await UIDLEntry.findOne({
    where: {
      UserUserId: userid,
      EntryName: entryname
    }
  });
  if (isFound) {
    return res.status(200).send({
      success: isFound
    });
  }
  return res.status(400).send({
    error: "Is not found"
  });
});

// ADD UIDL OR UPDATE EXISTING UIDL FOR THE USER
router.post("/save", authenticate, async (req, res) => {
  try {
    const { userid, uidlentry, entryname } = req.body;

    const isFound = await UIDLEntry.findOne({
      where: {
        UserUserId: userid,
        EntryName: entryname
      }
    });

    if (isFound) {
      isFound.UIDLEntry = uidlentry;
      await isFound.save({ fields: ["UIDLEntry"] });
      return res.status(200).send({
        success: `Success, uidl changed`
      });
    }

    await UIDLEntry.create({
      UserUserId: userid,
      UIDLEntry: uidlentry,
      EntryName: entryname
    });
    return res.status(200).send({
      success: `Success, uidl added`
    });
  } catch (err) {
    res.status(400).send({
      error: `Something went terribly wrong`
    });
  }
});

// DELETE UIDL FOR THE USER
router.delete("/delete", authenticate, async (req, res) => {
  try {
    const { userid, entryname } = req.body;
    const isFound = await UIDLEntry.findOne({
      where: {
        UserUserId: userid,
        EntryName: entryname
      }
    });
    if (isFound) {
      await isFound.destroy();
      return res.status(200).send({
        error: `Success, entry deleted`
      });
    }

    throw new Error("Did not find what to delete");
  } catch {
    res.status(403).send({
      error: `Could not delete entry`
    });
  }
});

module.exports = router;
