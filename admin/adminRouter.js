const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("../config/secret");

const model = require("./adminModel");

const router = express.Router();

router.get("/", (req, res) => {
  model
    .find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.post("/register", (req, res) => {
  const body = req.body;
  console.log("body", body);

  model
    .findBy(body.user)
    .then((person) => {
      if (!person[0]) {
        if (
          body.user &&
          body.password &&
          typeof body.password === "string" &&
          body.department &&
          typeof body.department === "string"
        ) {
          const rounds = process.env.BCRYPT_ROUNDS || 12;
          const hash = bcrypt.hashSync(body.password, rounds);
          body.password = hash;

          model
            .register(body)
            .then((newEmployee) => {
              console.log("new Employee", newEmployee);
              res.status(201).json(newEmployee);
            })
            .catch((err) => {
              console.log("new hire error", err);
              res.status(500).json({
                message: "server error hiring new employee",
                error: err,
              });
            });
        } else if (!body.department) {
          console.log("no dept", body);
          res.status(400).json({
            message: "Please add a department",
          });
        } else if (!body.user) {
          console.log("no name", body);
          res.status(400).json({
            message: "Please add a name",
          });
        } else if (!body.password) {
          console.log("no password", body);
          res.status(400).json({
            message: "Please add a password",
          });
        } else if (typeof body.password != "string") {
          res.status(400).json({
            message: "Password must be alphanumeric",
          });
        } else if (typeof body.department != "string") {
          res.status(400).json({
            message: "Department must be alphanumeric",
          });
        } else if (body.department == "admin") {
          console.log("new admin created");
        }
      } else {
        console.log("username taken");
        res.status(500).json({
          message: "That username is taken, please choose another",
        });
      }
    })
    .catch((error) => {
      console.log("Register Error", error);
      res.status(500).json({
        message: "server error creating a new user",
        error: error,
      });
    });
});

router.post("/login", (req, res) => {
  let { user, password } = req.body;

  model
    .findBy(user)
    .then(([employee]) => {
      if (employee && bcrypt.compareSync(password, employee.password)) {
        const token = generateToken(employee);

        res.status(200).json({
          message: `Welcome, ${employee.user}! Login Successful! Navigate to /users to see coworkers in your department!`,
          token,
        });
        req.headers.token = token;
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

function generateToken(guy) {
  const payload = {
    subject: guy.id,
    username: guy.user,
    department: guy.department,
  };
  const options = {
    expiresIn: "1h",
  };
  return jwt.sign(payload, secret.jwtSecret, options);
}

module.exports = router;
