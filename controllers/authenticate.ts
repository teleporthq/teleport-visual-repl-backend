const jwt = require("jsonwebtoken");

const authorization = (req, res, next) => {
  const authHeader = req.headers["access-token"];

  if (authorization == null) {
    return res.sendStatus(403);
  }

  jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

module.exports = authorization;
