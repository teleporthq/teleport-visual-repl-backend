import * as express from "express";
const router = express.Router();
const authorization = require("../controllers/authorization");
const userController = require("../controllers/userController");

// REGISTER NEW USER
router.post("/register", userController.add);

// LOGIN (EXISTING USER!!!!)
router.post("/signin", userController.signIn);

// DELETE USER
router.delete("/delete", authorization, userController.delete);

module.exports = router;

//  FOR FUTURE REFERENCE

// const authorizeUser = (req, res, next) => {
//   const authJWT = req.headers["authorization"];
//   if (!authJWT) {
//     return res.send(403);
//   }

//   let decrypredJWT = jwt.decrypt(authJWT);
//   decrypredJWT = {
//     canReadUIDL: true,
//     canWRITEUIDL: false
//   };

//   if (!decrypredJWT.canWriteUIDL) {
//     return res.send(403);
//   }

//   next();
// };
