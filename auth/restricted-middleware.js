const jwt = require("jsonwebtoken");
const secret = require("../config/secret");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secret.jwtSecret, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: "cheater cheater pumpkin eater" });
      } else {
        req.jwt = decodedToken;

        next();
      }
    });
  } else {
    res.status(400).json({ message: "Please provide auth info" });
  }
};
