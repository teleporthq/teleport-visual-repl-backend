import * as express from "express";
import { authorization } from "../controllers/authorization";
import { userController } from "../controllers/userController";

const router = express.Router();

// REGISTER NEW USER
router.post("/register", userController.addUser);

// LOGIN (EXISTING USER!!!!)
router.post("/signin", userController.signIn);

// DELETE USER
router.delete("/delete", authorization, userController.deleteUser);

export { router as authenticationRoute };
