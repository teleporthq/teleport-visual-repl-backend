import * as express from "express";
const router = express.Router();
const authorization = require("../controllers/authorization");
const uidlController = require("../controllers/uidlController");

// GET ALL UIDL NAMES THAT THE USER HAS
router.get("/all", authorization, uidlController.getAllUIDLNames);

// GET SPECIFIC UIDL FOR USER BY ITS NAME
router.get(
  "/one/:entryName",
  authorization,
  uidlController.getUIDLByNameAndUser
);

// ADD UIDL OR UPDATE EXISTING UIDL FOR THE USER
router.post("/save", authorization, uidlController.save);

// DELETE UIDL FOR THE USER
router.delete("/delete", authorization, uidlController.delete);

module.exports = router;
