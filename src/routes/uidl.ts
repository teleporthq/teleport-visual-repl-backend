import * as express from "express";
import { authorization } from "../controllers/authorization";
import { uidlController } from "../controllers/uidlController";

const router = express.Router();

// GET ALL UIDL NAMES THAT THE USER HAS
router.get("/all", authorization, uidlController.getAllUIDLNames);

// GET SPECIFIC UIDL FOR USER BY ITS NAME
router.get(
  "/one/:entryName",
  authorization,
  uidlController.getUIDLByNameAndUser
);

// ADD UIDL OR UPDATE EXISTING UIDL FOR THE USER
router.post("/save", authorization, uidlController.saveUidl);

// DELETE UIDL FOR THE USER
router.delete("/delete", authorization, uidlController.deleteUidl);

export { router as uidlRoute };
