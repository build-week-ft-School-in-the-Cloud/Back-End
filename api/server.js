const express = require("express");
const cors = require("cors");
// const restricted = require("../auth/restricted-middleware");

const server = express();

//Router
const adminRoutes = require("../admin/adminRouter");
const volunteerRoutes = require("../volunteer/volunteerRouter");
const studentRoutes = require("../students/studentRouter");

//Global use
server.use(express.json());
server.use(cors());

//Endpoints
server.use("/api/admin", adminRoutes);
server.use("/api/volunteer", volunteerRoutes);
server.use("/api/student", studentRoutes);

//Base url
server.get("/", (req, res) => {
  res.json("Server starts here, Navigate to /api");
});

server.get("/api", (req, res) => {
  res.json("Navigate to /admin, /volunteer, or /student");
});

module.exports = server;
