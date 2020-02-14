import * as express from "express";
import { UIDLEntry } from "../models/sequelize";
const router = express.Router();
const authenticate = require("../controllers/authenticate");

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
      await isFound.save();
      res.status(200).send({
        success: `Success, uidl changed`
      });
      return;
    }

    await UIDLEntry.create({
      UserUserId: userid,
      UIDLEntry: uidlentry,
      EntryName: entryname
    });
    res.status(200).send({
      success: `Success, uidl added`
    });
  } catch (err) {
    res.status(400).send({
      error: `Something went terribly wrong`
    });
  }
});

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
      res.status(200).send({
        error: `Success, entry deleted`
      });
      return;
    }

    throw new Error("Did not find what to delete");
  } catch {
    res.status(400).send({
      error: `Could not delete entry`
    });
  }
});

module.exports = router;
