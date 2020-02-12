import * as express from "express";
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

// placeholder to test out routes till we connect to a db

const fakeDataBase = [
  { name: "Tudor", password: "123" },
  { name: "Ale", password: "1234" },
  { name: "Vlad", password: "111" },
  { name: "Ionut", password: "florinSalam" }
];

router.post("/signin", async (req, res) => {
  const isFound = fakeDataBase.find(user => {
    return req.body.name === user.name;
  });

  if (!isFound) {
    res.status(401).send({ error: "User does not exist!" });
    return;
  }

  const passwordMatch = await bcrypt.compare(
    req.body.password,
    isFound.password
  );
  // Check with Postman with a new registered user and after with someone unregistered to see the difference
  console.log(
    "User is in the DB!Has he provided the correct password? ",
    passwordMatch
  );

  if (passwordMatch) {
    res.status(200).send({
      message: "Sign in succesfull!",
      greet: `Welcome ${req.body.name}`
    });
    return;
  }

  res.status(403).send({ error: "Wrong username or password! " });
});

router.post("/register", (req, res) => {
  const isFound = fakeDataBase.find(user => req.body.name === user.name);
  if (isFound) {
    res.status(418).send({
      error: `User ${req.body.name} already exists! Pick something else!`
    });
  } else {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      try {
        fakeDataBase.push({ name: req.body.name, password: hash });
        res.status(201).send({
          message: "Register succesfull!",
          greet: `Welcome ${req.body.name}`
        });
      } catch (err) {
        console.log(err);
      }
    });
  }
});

module.exports = router;
