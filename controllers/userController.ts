import jwt from "jsonwebtoken";
const userRepository = require("../repositories/userRepository");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = async (password): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err, hash: string) => {
      err ? reject(err) : resolve(hash);
    });
  });
};

exports.add = async (req, res) => {
  const { eMail, username, password } = req.body;
  const isFound = await userRepository.findUserByEmailOrUsername(
    eMail,
    username
  );

  if (isFound) {
    return res.status(418).send({
      error: `Username or eMail in use! Pick something else!`
    });
  }

  const hashedPassword = await hashPassword(password);

  const user = await userRepository.createNewUser(
    eMail,
    username,
    hashedPassword
  );

  const jwtDetails = {
    userId: user.UserId,
    username: user.Username
  };

  const accessToken = jwt.sign(jwtDetails, process.env.ACCESS_TOKEN_SECRET);
  console.log(accessToken);

  return res.status(201).send({
    accessToken,
    message: "Register succesfull!",
    greet: `Welcome ${username}`
  });
};

exports.signIn = async (req, res) => {
  try {
    const loginToken: string = req.body.loginToken;
    const userInDb = await userRepository.findUserByEmailOrUsername(
      loginToken,
      loginToken
    );

    if (!userInDb) {
      return res.status(403).send({ error: "Invalid credentials!" });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userInDb.Password
    );

    if (passwordMatch) {
      // - generate JWT token for user
      const user = { username: userInDb.Username, userId: userInDb.UserId };
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

      return res.status(200).send({
        accessToken,
        message: "Sign in succesfull!",
        greet: `Welcome ${userInDb.Username}`
      });
    }
  } catch (err) {
    return res.status(403).send({ error: "Invalid credentials!" });
  }
};

exports.delete = async (req, res) => {
  const userId = req.user.userId;
  try {
    const userInDb = await userRepository.findUserById(userId);

    userRepository.deleteUser(userInDb);

    return res.status(200).send({ success: "User deleted!" });
  } catch (err) {
    return res.status(400).send({ error: "Something baaaad happened " + err });
  }
};
