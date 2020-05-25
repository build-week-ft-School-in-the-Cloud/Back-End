const db = require("../data/dbConfig");

module.exports = {
  getAll,
  findByCountry,
  findByUsername,
  // findAllByUsername,
  findProfile,
  register,
  getToDoLists,
  findListByProfile,
};

//Returns everything from an admin perspective, which is in charge of which volunteer and which students are under them
//Wish i could get it to display the info in a more streamlined way but it works
function getAll() {
  return db("administrator as a")
    .leftJoin("volunteer as v", "a.id", "v.adminId")
    .leftJoin("student as s", "v.id", "s.volunteerId")
    .select(
      "a.username as Admin Username",
      "a.forename as Admin First Name",
      "a.surname as Admin Last Name",
      "v.username as Assigned Volunteer Username",
      "v.forename as Assigned Volunteer First Name",
      "v.surname as Assigned Volunteer Last Name",
      "s.username as Assigned Student Username",
      "s.forename as Assigned Student First Name",
      "s.surname as Assigned Student Last Name",
      "s.country as Shared Country"
    )
    .orderBy("a.id");
}

//Returns all Admins in a specific country and displays their name and username
function findByCountry(country) {
  return db("administrator as a")
    .leftJoin("volunteer as v", "a.id", "v.adminId")
    .leftJoin("student as s", "v.id", "s.volunteerId")
    .select(
      "a.username as Admin Username",
      "a.forename as Admin First Name",
      "a.surname as Admin Last Name",
      "v.username as Assigned Volunteer Username",
      "v.forename as Assigned Volunteer First Name",
      "v.surname as Assigned Volunteer Last Name",
      "s.username as Assigned Student Username",
      "s.forename as Assigned Student First Name",
      "s.surname as Assigned Student Last Name"
    )
    .where("a.country", country)
    .orderBy("v.id");
}

//Returns all Admins with a specific username, used for login
function findByUsername(username) {
  return db("administrator as a").where("a.username", username);
}

//Returns all with a specific username, possibly search function in future
// function findAllByUsername(username) {
//   return db("administrator as a")
//     .leftJoin("volunteer as v", "a.id", "v.adminId")
//     .leftJoin("student as s", "v.id", "s.volunteerId")
//     .where("username", username);
// }

//returns Admin specific information with specific ID number.
function findProfile(id) {
  return db("administrator as a")
    .leftJoin("volunteer as v", "a.id", "v.adminId")
    .leftJoin("lists as l", "a.id", "l.adminId")
    .leftJoin("items as i", "l.id", "i.listId")
    .select(
      "v.username as Volunteer Username",
      "v.forename as Volunteer First Name",
      "v.surname as Volunteer Last Name",
      "l.toDoListName as List Name",
      "i.item as Item Name",
      "i.completed as Item Completion"
    )
    .where("a.id", id)
    .orderBy("v.id");
}

//Used to register a new Admin to the database
//WARNING DO NOT ADD MORE THAN ONE ADMIN FOR EACH COUNTRY, UNTESTED!!!!!
function register(person) {
  return db("administrator as a")
    .insert(person, "*")
    .then(([newUser]) => {
      return newUser;
    });
}

function getToDoLists() {
  return db("lists as l")
    .leftJoin("items as i", "l.id", "i.listId")
    .leftJoin("administrator as a", "l.adminId", "a.id")
    .leftJoin("volunteer as v", "l.volunteerId", "v.id")
    .select(
      "a.username as Assigned by Admin",
      // "a.forename as Admin First Name",
      // "a.surname as Admin Last Name",
      "v.username as Assigned to Volunteer",
      // "v.forename as Assigned Volunteer First Name",
      // "v.surname as Assigned Volunteer Last Name",
      "l.toDoListName as List Name",
      "i.item as Item Name",
      "i.completed as Item Completion"
    )
    .orderBy("a.id");
}

function findListByProfile(id) {
  return db("lists as l")
    .leftJoin("items as i", "l.id", "i.listId")
    .leftJoin("administrator as a", "l.adminId", "a.id")
    .leftJoin("volunteer as v", "l.volunteerId", "v.id")
    .select(
      "l.toDoListName as List Name",
      "v.username as Assigned to Volunteer",
      "v.forename as Assigned Volunteer First Name",
      "v.surname as Assigned Volunteer Last Name",
      "i.item as Item Name",
      "i.completed as Item Completion"
    )
    .where("a.id", id)
    .orderBy("v.id");
}
