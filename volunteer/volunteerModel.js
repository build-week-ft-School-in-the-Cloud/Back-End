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
  return (
    db("volunteer as v")
      .leftJoin("administrator as a", "a.id", "v.adminId")
      .leftJoin("student as s", "v.id", "s.volunteerId")
      .select(
        //Volunteer info
        "v.id as Volunteer ID",
        "v.username as Volunteer Username",
        "v.forename as Volunteer First Name",
        "v.surname as Volunteer Last Name",
        "v.country as Volunteer Country",
        //Admin info
        "a.id as Admin ID",
        "a.username as Assigned Admin Username",
        "a.forename as Assigned Admin First Name",
        "a.surname as Assigned Admin Last Name",
        "a.country as Assigned Admin Country",
        "s.id as Student ID",
        //Student info
        "s.username as Assigned Student Username",
        "s.forename as Assigned Student First Name",
        "s.surname as Assigned Student Last Name",
        "s.country as Assigned Student Country"
      )
      //sorted by Volunteer id number
      .orderBy("v.id")
  );
}

//Returns all Volunteers in a specific country and displays their name and username
function findByCountry(country) {
  return (
    db("volunteer as v")
      .leftJoin("administrator as a", "a.id", "v.adminId")
      .leftJoin("student as s", "v.id", "s.volunteerId")
      .select(
        //Admin info
        "a.id as Admin ID",
        "a.username as Assigned Admin Username",
        "a.forename as Assigned Admin First Name",
        "a.surname as Assigned Admin Last Name",
        //volunteer info
        "v.id as Volunteer ID",
        "v.username as Volunteer Username",
        "v.forename as Volunteer First Name",
        "v.surname as Volunteer Last Name",
        //Student info
        "s.id as Student ID",
        "s.username as Assigned Student Username",
        "s.forename as Assigned Student First Name",
        "s.surname as Assigned Student Last Name"
      )
      //filtered and sorted by Volunteer
      .where("v.country", country)
      .orderBy("v.id")
  );
}

//Returns all Volunteers with a specific username, used for login
function findByUsername(username) {
  return db("volunteer as v").where("v.username", username);
}

//returns Volunteer specific information with specific ID number.
function findProfile(id) {
  return (
    db("volunteer as v")
      .leftJoin("administrator as a", "a.id", "v.adminId")
      .leftJoin("lists as l", "a.id", "l.adminId")
      .leftJoin("items as i", "l.id", "i.listId")
      .select(
        //Admin info
        "a.username as Admin Username",
        "a.forename as Admin First Name",
        "a.surname as Admin Last Name",
        //List info
        "l.toDoListName as List Name",
        //Item info
        "i.item as Item Name",
        "i.completed as Item Completion"
      )
      //filtered and sorted by Voliunteer
      .where("v.id", id)
      .orderBy("v.id")
  );
}

//Used to register a new Volunteer to the database
function register(person) {
  return db("volunteer as v")
    .insert(person, "*")
    .then(([newUser]) => {
      return newUser;
    });
}
//To-do Lists specific to specific Volunteer
function findListByProfile(id) {
  return (
    db("lists as l")
      .leftJoin("items as i", "l.id", "i.listId")
      .leftJoin("administrator as a", "l.adminId", "a.id")
      .leftJoin("volunteer as v", "l.volunteerId", "v.id")
      .select(
        //List info
        "l.toDoListName as List Name",
        //Admin info
        "a.username as Assigned by Admin",
        "a.forename as Assigned Admin First Name",
        "a.surname as Assigned Admin Last Name",
        //Item info
        "i.item as Item Name",
        "i.completed as Item Completion"
      )
      //filtered by volunteer id number
      .where("v.id", id)
      //sorted by id number of Admin
      .orderBy("a.id")
  );
}
