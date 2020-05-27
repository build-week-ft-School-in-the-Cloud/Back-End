const express = require("express");
const bcrypt = require("bcryptjs");
const restricted = require("../auth/restricted-middleware");
const genTok = require("../auth/generateToken");

const model = require("./volunteerModel");

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
          typeof body.country === "string" &&
          body.adminId
        ) {
          const rounds = process.env.BCRYPT_ROUNDS || 12;
          const hash = bcrypt.hashSync(body.password, rounds);
          body.password = hash;

          model
            .register(body)
            .then((newVolunteer) => {
              console.log("new Volunteer", newVolunteer);
              res.status(201).json(newVolunteer);
            })
            .catch((err) => {
              console.log("new volunteer error", err);
              res.status(500).json({
                message: "server error hiring new volunteer",
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
        } else if (!body.adminId) {
          console.log("no admin", body);
          res.status(400).json({
            message: "Please add your assigned admin's id number",
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
      //locates username stored in volunteer database
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

//All Volunteers and their chains on this GET
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

//Profile Specific Endpoints
router.get("/profile", restricted, (req, res) => {
  const id = req.jwt.subject;
  if (id) {
    model
      .findProfile(id)
      .then((data) => {
        console.log("findProfile", data);
        res.status(200).json({
          message:
            "Welcome to your profile, below you will find information relevant to you. Navigate to /country, or /lists for more information",
          data: data,
        });
      })
      .catch((error) => {
        console.log("findProfile error", error);
        res.status(500).json(error);
      });
  } else {
    res.status(404).json({ message: "id not found" });
  }
});

router.get("/profile/country", restricted, (req, res) => {
  //grabs country property from token and filters volunteer database
  const country = req.jwt.country;
  if (country) {
    model
      .findByCountry(country)
      .then((newData) => {
        console.log("country", newData);
        res.status(200).json(newData);
      })
      .catch((error) => {
        console.log("country error", error);
        res.status(500).json(error);
      });
  } else {
    res.status(404).json({ message: "country not found" });
  }
});

router.get("/profile/lists", restricted, (req, res) => {
  //grabs subject property from token and filters volunteer database for specific lists
  const id = req.jwt.subject;
  if (id) {
    model
      .findListByProfile(id)
      .then((newData) => {
        console.log("profile lists", newData);
        res.status(200).json(newData);
      })
      .catch((error) => {
        console.log("profile lists error", error);
        res.status(500).json(error);
      });
  } else {
    res.status(404).json({ message: "id not found" });
  }
});

module.exports = router;
