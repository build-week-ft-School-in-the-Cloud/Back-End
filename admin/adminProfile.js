const express = require("express");

const model = require("./adminModel");

const router = express.Router();

//Profile Specific Endpoints
router.get("/", (req, res) => {
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

router.get("/country", (req, res) => {
  //grabs country property from token and filters admin database
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

router.get("/lists", (req, res) => {
  //grabs subject property from token and filters admin database for specific lists
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

router.post("/lists", (req, res) => {
  const body = req.body;
  const id = req.jwt.subject;

  if (id) {
    body.adminId = id;
    if (
      body.toDoListName &&
      typeof body.toDoListName === "string" &&
      body.volunteerId
    ) {
      model
        .registerList(body)
        .then((newData) => {
          console.log("New list", newData);
          res.status(200).json(newData);
        })
        .catch((error) => {
          console.log("new list error", error);
          res.status(500).json(error);
        });
    } else if (!body.toDoListName) {
      res
        .status(400)
        .json({ message: "Please include a name for the to-do list" });
    } else if (typeof body.toDoListName != "string") {
      res.status(400).json({ message: "To Do List Name must be alphanumeric" });
    } else if (!body.volunteerId) {
      res.status(400).json({
        message: "Please include the ID number of the assigned volunteer",
      });
    }
  } else {
    res.status(404).json({ message: "id not found" });
  }
});

router.get("/lists/:id", (req, res) => {
  const id = req.params.id;
  const user = req.jwt.subject;

  if (user) {
    model
      .findListByProfile(user)
      .then((filteredLists) => {
        console.log("filtered lists", filteredLists);
        model
          .findListInfoinMoreDetail(id)
          .then((data) => {
            if (filteredLists[0].admin == data[0].admin) {
              console.log("list detail data\n", data);
              res.status(200).json(data);
            } else if (filteredLists[0].list != data[0].list) {
              res.status(401).json({ message: "Assigned to another Admin" });
            }
          })
          .catch((error) => {
            console.log("list detail error", error);
            res.status(500).json(error);
          });
      })
      .catch((error) => {
        res.status(500).json("error filtering lists \n", error);
      });
  } else {
    res.status(404).json({ message: "User ID not found" });
  }
});

router.put("/lists/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const user = req.jwt.subject;

  if (user) {
    model
      .findListByProfile(user)
      .then((filteredLists) => {
        console.log("filtered lists", filteredLists);
        model
          .findListInfoinMoreDetail(id)
          .then((data) => {
            if (filteredLists[0].admin == data[0].admin) {
              console.log("list detail data\n", data);
              res.status(200).json(data);
            } else if (filteredLists[0].list != data[0].list) {
              res.status(401).json({ message: "Assigned to another Admin" });
            }
          })
          .catch((error) => {
            console.log("list detail error", error);
            res.status(500).json(error);
          });
      })
      .catch((error) => {
        res.status(500).json("error filtering lists \n", error);
      });
  } else {
    res.status(404).json({ message: "User ID not found" });
  }
});

router.delete("/lists/:id", (req, res) => {
  const id = req.params.id;
  const user = req.jwt.subject;

  if (user) {
    model
      .removeList(id)
      .then((deleted) => {
        if (deleted) {
          res.json({ removed: deleted });
        } else {
          res
            .status(404)
            .json({ message: "Could not find list with given id" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to delete list", error: err });
      });
  } else {
    res.status(404).json({ message: "User ID not found" });
  }
});

router.get("/lists/:id/:item", (req, res) => {
  const id = req.params.id;
  const item = req.params.item;
  const user = req.jwt.subject;

  if (user) {
    model.findListByProfile(user).then((filItems) => {
      console.log("fil items", filItems);
      model
        .itemDetail(id, item)
        .then(([stuff]) => {
          if (id == stuff.list) {
            if (item == stuff.item) {
              res.status(200).json(stuff);
            }
          } else {
            res.status(404).json({ message: "No Item Found" });
          }
        })
        .catch((error) => {
          console.log("items", error);
          res.status(500).json(error);
        });
    });
  } else {
    res.status(404).json({ message: "User ID not found" });
  }
});

router.put("/lists/:id/:item", (req, res) => {
  const id = req.params.id;
  const item = req.params.item;
  const user = req.jwt.subject;

  if (user) {
    model.findListByProfile(user).then((filItems) => {
      console.log("fil items", filItems);
      model
        .itemDetail(id, item)
        .then(([stuff]) => {
          if (id == stuff.list) {
            if (item == stuff.item) {
              res.status(200).json(stuff);
            }
          } else {
            res.status(404).json({ message: "No Item Found" });
          }
        })
        .catch((error) => {
          console.log("items", error);
          res.status(500).json(error);
        });
    });
  } else {
    res.status(404).json({ message: "User ID not found" });
  }
});

router.delete("/lists/:id/:item", (req, res) => {
  const id = req.params.id;
  const item = req.params.item;
  const user = req.jwt.subject;

  if (user) {
    id = model
      .removeItem(id, item)
      .then((deleted) => {
        if (deleted) {
          res.json({ removed: deleted });
        } else {
          res
            .status(404)
            .json({ message: "Could not find item with given id" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to delete item", error: err });
      });
  } else {
    res.status(404).json({ message: "User ID not found" });
  }
});

module.exports = router;
