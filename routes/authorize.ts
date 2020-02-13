import * as express from "express";
import { User, Sequelize } from "../models/sequelize";
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
  // Check with Postman with a new registered user and after with someone unregistered to see the difference
  console.log(
    "User is in the DB!Has he provided the correct password? ",
    passwordMatch
  );

  if (passwordMatch) {
    res.status(200).send({
      message: "Sign in succesfull!",
      greet: `Welcome ${isFound.Username}`
    });
    return;
  }

  res.status(403).send({ error: "Wrong username or password! " });
});

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
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    try {
      User.create({
        Username: req.body.username,
        Password: hash,
        eMail: req.body.email
      });
      res.status(201).send({
        message: "Register succesfull!",
        greet: `Welcome ${req.body.username}`
      });
    } catch (err) {
      console.log(err);
    }
  });
});

module.exports = router;
