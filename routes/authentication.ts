import * as express from "express";
import { User, Sequelize } from "../repositories/sequelize";
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const authorization = require("../controllers/authorization");

router.post("/register", async (req, res) => {
  try {
    const isFound = await User.findOne({
      where: {
        [Sequelize.Op.or]: [
          { email: req.body.email },
          { Username: req.body.username }
        ]
      }
    });

    if (isFound) {
      res.status(418).send({
        error: `Username or email in use! Pick something else!`
      });
      return;
    }

    const hashedPassword = await hashPassword(req.body.password);

    const user = await User.create({
      Username: req.body.username,
      Password: hashedPassword,
      eMail: req.body.email
    });
    const accessToken = jwt.sign(
      user.dataValues,
      process.env.ACCESS_TOKEN_SECRET
    );

    res.status(201).send({
      accessToken,
      message: "Register succesfull!",
      greet: `Welcome ${req.body.username}`
    });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong: " + error });
  }
});

router.post("/signin", async (req, res) => {
  const isFound = await User.findOne({
    where: {
      [Sequelize.Op.or]: [
        { email: req.body.loginToken },
        { Username: req.body.loginToken }
      ]
    }
  }).catch(err => console.log(err));

  if (!isFound) {
    res.status(401).send({ error: "Invalid credentials!" });
    return;
  }
  const passwordMatch = await bcrypt.compare(
    req.body.password,
    isFound.Password
  );

  if (passwordMatch) {
    // - generate JWT token for user
    const user = { name: isFound.name, email: isFound.email };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).send({
      accessToken,
      message: "Sign in succesfull!",
      greet: `Welcome ${isFound.Username}`
    });
    return;
  }

  res.status(403).send({ error: "Wrong username or password! " });
});

router.delete("/delete", authorization, async (req, res) => {
  try {
    const isFound = await User.findOne({
      where: { UserId: req.body.userId }
    });
    if (isFound) {
      isFound.destroy();
      return res.status(200).send({ success: "User deleted!" });
    }
    throw new Error(`User does not exist`);
  } catch (err) {
    return res.status(400).send({ error: "Something baaaad happened " + err });
  }
});

const hashPassword = async (password): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash: string) => {
      err ? reject(err) : resolve(hash);
    });
  });
};

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
