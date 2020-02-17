import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const authHeader: string | string[] = req.headers["access-token"];

  if (authorization == null) {
    return res.sendStatus(403);
  }

  jwt.verify(
    <string>authHeader,
    process.env.ACCESS_TOKEN_SECRET,
    (err: Error, user: string | object) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.body.user = user;
      next();
    }
  );
};

export { authorization };
