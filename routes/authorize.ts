import * as express from "express";
const router = express.Router();

// placeholder to test out routes till we connect to a db

const dataBase = [
  { name: "Tudor", password: "123" },
  { name: "Ale", password: "1234" },
  { name: "Vlad", password: "111" },
  { name: "Ionut", password: "florinSalam" }
];

router.post("/signin", (req, res) => {
  const isFound = dataBase.find(
    user => req.body.name === user.name && req.body.password === user.password
  );
  if (isFound) {
    res.status(200).send({
      message: "Sign in succesfull!",
      greet: `Welcome ${req.body.name}`
    });
    return;
  }

  res.status(401).send({ error: "Wrong username or password! " });
});

router.post("/register", (req, res) => {
  const isFound = dataBase.find(user => req.body.name === user.name);
  if (isFound) {
    res.status(418).send({
      error: `User ${req.body.name} already exists! Pick something else!`
    });
  } else {
    dataBase.push({ name: req.body.name, password: req.body.password });
    res.status(200).send({
      message: "Register succesfull!",
      greet: `Welcome ${req.body.name}`
    });
  }
});

module.exports = router;
