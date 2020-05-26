const express = require("express");
const bcrypt = require("bcryptjs");
const restricted = require("../auth/restricted-middleware");
const genTok = require("../auth/generateToken");

const model = require("./adminModel");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(
    "Navigate to /register if you dont have an account or /login if you have an account"
  );
});

//User Creation/Login Starts here
router.post("/register", (req, res) => {
  const body = req.body;
  console.log("body", body);

  model
    .findByUsername(body.username)
    .then((person) => {
      if (!person[0]) {
        //checking for invalid credentials. Ignore
        if (
          body.username &&
          body.password &&
          typeof body.password === "string" &&
          body.forename &&
          typeof body.forename === "string" &&
          body.surname &&
          typeof body.surname === "string" &&
          body.country &&
          typeof body.country === "string"
        ) {
          const rounds = process.env.BCRYPT_ROUNDS || 12;
          const hash = bcrypt.hashSync(body.password, rounds);
          body.password = hash;

          model
            .register(body)
            .then((newAdmin) => {
              console.log("new Admin", newAdmin);
              res.status(201).json(newAdmin);
            })
            .catch((err) => {
              console.log("new admin error", err);
              res.status(500).json({
                message: "server error hiring new administrator",
                error: err,
              });
            });
          //Ignore. Else statement for specific invalid credentials
        } else if (!body.username) {
          console.log("no username", body);
          res.status(400).json({
            message: "Please add a usernaname",
          });
        } else if (!body.forename || !body.surname) {
          console.log("no name", body);
          res.status(400).json({
            message: "Please add your first and last name",
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
        } else if (
          typeof body.forename != "string" ||
          typeof body.surname != "string"
        ) {
          res.status(400).json({
            message: "First and Last name must be alphanumeric",
          });
        } else if (!body.country) {
          console.log("no country", body);
          res.status(400).json({
            message: "Please add your country",
          });
        } else if (typeof body.country != "string") {
          res.status(400).json({
            message: "Country must be alphanumeric",
          });
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
  let { username, password } = req.body;

  if (username) {
    model
      //locates username stored in admin database
      .findByUsername(username)
      .then(([employee]) => {
        //compares given password to stored hashed password
        if (employee && bcrypt.compareSync(password, employee.password)) {
          const token = genTok.generateToken(employee);

          res.status(200).json({
            message: `Welcome, ${employee.username}! Login Successful! Navigate to /users or /profile`,
            token,
          });
          //You typed something in wrong
        } else {
          res.status(401).json({ message: "Invalid Credentials" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ err });
      });
  } else {
    res.status(404).json({ message: "Username not found" });
  }
});
//User Creation/Login Ends here

//All Admins and their chains on this GET
router.get("/users", restricted, (req, res) => {
  model
    .getAll()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.get("/lists", restricted, (req, res) => {
  model
    .getToDoLists()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});
module.exports = router;
