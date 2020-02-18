import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const saltRounds = 10;

const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, (err: Error, hash: string) => {
      err ? reject(err) : resolve(hash);
    });
  });
};

const addUser = async (req: Request, res: Response): Promise<Response> => {
  const { eMail, username, password } = req.body;
  try {
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

    return res.status(201).send({
      accessToken,
      message: "Register succesfull!",
      greet: `Welcome ${username}`
    });
  } catch (err) {
    console.log("Error", err);
    return res.status(400).send({
      error: "Register unsuccesfull!"
    });
  }
};

const signIn = async (req: Request, res: Response): Promise<Response> => {
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
    throw new Error();
  } catch (err) {
    return res.status(403).send({ error: "Invalid credentials!" });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  const userId = req.body.user.userId;
  try {
    const userInDb = await userRepository.findUserById(userId);

    userRepository.deleteUser(userInDb);

    return res.status(200).send({ success: "User deleted!" });
  } catch (err) {
    return res.status(400).send({ error: "Something baaaad happened " + err });
  }
};

const userController = {
  addUser,
  signIn,
  deleteUser
};

export { userController };
