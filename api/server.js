const express = require("express");
const cors = require("cors");
// const restricted = require("../auth/restricted-middleware");

const server = express();

//Router
const routes = require("../admin/adminRouter");

server.use(express.json());
server.use(cors());

//Endpoints
server.use("/api/admin", routes);

//Base url
server.get("/", (req, res) => {
  res.json("Server starts here, Navigate to /api");
});
server.get("/api", (req, res) => {
  res.json("Navigate to /auth");
});
module.exports = server;
