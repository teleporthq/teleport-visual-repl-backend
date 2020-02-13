import * as express from "express";
const router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

// placeholder to test out routes till we connect to a db

const fakeDataBase = [];

router.post("/register", async (req, res) => {
  const isFound = fakeDataBase.find(user => req.body.name === user.name);
  if (isFound) {
    res.status(418).send({
      error: `User ${req.body.name} already exists! Pick something else!`
    });
    return;
  }

  try {
    const hashedPassword = await hashPassword(req.body.password);
    fakeDataBase.push({
      name: req.body.name,
      password: hashedPassword,
      email: req.body.email
    });
    const user = { name: req.body.name, email: req.body.email };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.status(201).send({
      accessToken,
      message: "Register succesfull!",
      greet: `Welcome ${req.body.name}`
    });
  } catch (error) {
    res.status(400).send({ error: "Something went wrong" });
  }
});

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

  if (passwordMatch) {
    // - generate JWT token for user
    const user = { name: isFound.name, email: isFound.email };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.status(200).send({
      accessToken,
      message: "Sign in succesfull!",
      greet: `Welcome ${req.body.name}`
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
