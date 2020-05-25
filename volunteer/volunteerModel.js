const db = require("../data/dbConfig");

module.exports = {
  getAll,
  findByCountry,
  findByUsername,
  findProfile,
  register,
  findListByProfile,
};

//Returns everything from a volunteer perspective, which students are under them
//Wish i could get it to display the info in a more streamlined way but it works
function getAll() {
  return db("volunteer as v")
    .leftJoin("administrator as a", "a.id", "v.adminId")
    .leftJoin("student as s", "v.id", "s.volunteerId")
    .select(
      "v.id as Volunteer ID",
      "v.username as Volunteer Username",
      "v.forename as Volunteer First Name",
      "v.surname as Volunteer Last Name",
      "a.id as Admin ID",
      "a.username as Assigned Admin Username",
      "a.forename as Assigned Admin First Name",
      "a.surname as Assigned Admin Last Name",
      "s.id as Student ID",
      "s.username as Assigned Student Username",
      "s.forename as Assigned Student First Name",
      "s.surname as Assigned Student Last Name",
      "s.country as Shared Country"
    )
    .orderBy("v.id");
}

//Returns all Volunteers in a specific country and displays their name and username
function findByCountry(country) {
  return db("volunteer as v")
    .leftJoin("administrator as a", "a.id", "v.adminId")
    .leftJoin("student as s", "v.id", "s.volunteerId")
    .select(
      "a.id as Admin ID",
      "a.username as Assigned Admin Username",
      "a.forename as Assigned Admin First Name",
      "a.surname as Assigned Admin Last Name",
      "v.id as Volunteer ID",
      "v.username as Volunteer Username",
      "v.forename as Volunteer First Name",
      "v.surname as Volunteer Last Name",
      "s.id as Student ID",
      "s.username as Assigned Student Username",
      "s.forename as Assigned Student First Name",
      "s.surname as Assigned Student Last Name"
    )
    .where("v.country", country)
    .orderBy("v.id");
}

//Returns all Volunteers with a specific username, used for login
function findByUsername(username) {
  return db("volunteer as v").where("v.username", username);
}

//returns Volunteer specific information with specific ID number.
function findProfile(id) {
  return db("volunteer as v")
    .leftJoin("administrator as a", "a.id", "v.adminId")
    .leftJoin("lists as l", "a.id", "l.adminId")
    .leftJoin("items as i", "l.id", "i.listId")
    .select(
      "a.username as Admin Username",
      "a.forename as Admin First Name",
      "a.surname as Admin Last Name",
      "l.toDoListName as List Name",
      "i.item as Item Name",
      "i.completed as Item Completion"
    )
    .where("v.id", id)
    .orderBy("v.id");
}

//Used to register a new Volunteer to the database
//WARNING DO NOT ADD MORE THAN ONE ADMIN FOR EACH COUNTRY, UNTESTED!!!!!
function register(person) {
  return db("volunteer as v")
    .insert(person, "*")
    .then(([newUser]) => {
      return newUser;
    });
}

function findListByProfile(id) {
  return db("lists as l")
    .leftJoin("items as i", "l.id", "i.listId")
    .leftJoin("administrator as a", "l.adminId", "a.id")
    .leftJoin("volunteer as v", "l.volunteerId", "v.id")
    .select(
      "l.toDoListName as List Name",
      "a.username as Assigned by Admin",
      "a.forename as Assigned Admin First Name",
      "a.surname as Assigned Admin Last Name",
      "i.item as Item Name",
      "i.completed as Item Completion"
    )
    .where("v.id", id)
    .orderBy("a.id");
}
