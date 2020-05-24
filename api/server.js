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
  res.json("Server starts here, Navigate to /api");
});
server.get("/api", (req, res) => {
  res.json("Navigate to /auth");
});
module.exports = server;
