const jwt = require("jsonwebtoken");
const secret = require("../config/secret");

//Auth Token, good for 24 hours
module.exports = { generateToken };

function generateToken(guy) {
  const payload = {
    subject: guy.id,
    username: guy.username,
    name: guy.forename + " " + guy.surname,
    country: guy.country,
  };
  const options = {
    expiresIn: "1d",
  };
  return jwt.sign(payload, secret.jwtSecret, options);
}
