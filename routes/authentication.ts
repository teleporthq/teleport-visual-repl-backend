import * as express from "express";
import { User, Sequelize } from "../models/sequelize";
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const isFound = await User.findOne({
    where: {
      [Sequelize.Op.or]: [
        { email: req.body.email },
        { Username: req.body.username }
      ]
    }
  }).catch(err => console.log(err));
  if (isFound) {
    res.status(418).send({
      error: `Username or email in use! Pick something else!`
    });
    return;
  }

  try {
    const hashedPassword = await hashPassword(req.body.password);
    User.create({
      Username: req.body.username,
      Password: hashedPassword,
      eMail: req.body.email
    });
    const user = { name: req.body.name, email: req.body.email };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.status(201).send({
      accessToken,
      message: "Register succesfull!",
      greet: `Welcome ${req.body.username}`
    });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong" });
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