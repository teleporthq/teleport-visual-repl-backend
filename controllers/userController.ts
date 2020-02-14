import { User, Sequelize } from "../repositories/sequelize";
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const hashPassword = async (password): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash: string) => {
      err ? reject(err) : resolve(hash);
    });
  });
};

exports.add = async (req, res) => {
  const isFound = await User.findOne({
    where: {
      [Sequelize.Op.or]: [
        { eMail: req.body.eMail },
        { Username: req.body.username }
      ]
    }
  });

  if (isFound) {
    return res.status(418).send({
      error: `Username or eMail in use! Pick something else!`
    });
  }

  const hashedPassword = await hashPassword(req.body.password);

  const user = await User.create({
    Username: req.body.username,
    Password: hashedPassword,
    eMail: req.body.eMail
  });

  const jwtDetails = {
    userId: user.UserId,
    username: user.Username
  };

  const accessToken = jwt.sign(jwtDetails, process.env.ACCESS_TOKEN_SECRET);
  console.log(accessToken);

  return res.status(201).send({
    accessToken,
    message: "Register succesfull!",
    greet: `Welcome ${req.body.username}`
  });
};

exports.signIn = async (req, res) => {
  const isFound = await User.findOne({
    where: {
      [Sequelize.Op.or]: [
        { eMail: req.body.loginToken },
        { Username: req.body.loginToken }
      ]
    }
  }).catch(err => console.log(err));

  if (!isFound) {
    return res.status(403).send({ error: "Invalid credentials!" });
  }
  const passwordMatch = await bcrypt.compare(
    req.body.password,
    isFound.Password
  );

  if (passwordMatch) {
    // - generate JWT token for user
    const user = { username: isFound.Username, userId: isFound.UserId };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    return res.status(200).send({
      accessToken,
      message: "Sign in succesfull!",
      greet: `Welcome ${isFound.Username}`
    });
  }

  return res.status(403).send({ error: "Invalid credentials!" });
};

exports.delete = async (req, res) => {
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
};
