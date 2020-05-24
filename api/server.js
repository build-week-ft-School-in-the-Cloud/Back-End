const express = require("express");
const cors = require("cors");
const secret = require("../config/secret");
const restricted = require("../auth/restricted-middleware");

const server = express();

//Router

server.use(express.json());
server.use(cors());

//Endpoints

//Base url
server.get("/", (req, res) => {
  res.send("<h1> Server starts here</h1> <h2> Navigate to</h2> <h3>/api</h3>");
});
module.exports = server;
