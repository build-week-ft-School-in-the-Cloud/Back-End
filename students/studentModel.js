const db = require("../data/dbConfig");

module.exports = {
  getAll,
  findByCountry,
  findByUsername,
  findProfile,
  register,
};

//Returns everything from a student perspective, which volunteers are teaching them
//Wish i could get it to display the info in a more streamlined way but it works
function getAll() {
  return db("student as s")
    .leftJoin("volunteer as v", "v.id", "s.volunteerId")
    .select(
      "v.id as Volunteer ID",
      "v.username as Teacher Username",
      "v.forename as Teacher First Name",
      "v.surname as Teacher Last Name",
      "s.id as Student ID",
      "s.username as Student Username",
      "s.forename as Student First Name",
      "s.surname as  Student Last Name",
      "s.country as Shared Country"
    )
    .orderBy("s.id");
}

//Returns all Students in a specific country and displays their name and username
function findByCountry(country) {
  return db("student as s")
    .leftJoin("volunteer as v", "v.id", "s.volunteerId")
    .select(
      "v.id as Volunteer ID",
      "v.username as Teacher Username",
      "v.forename as Teacher First Name",
      "v.surname as Teacher Last Name",
      "s.id as Student ID",
      "s.username as Student Username",
      "s.forename as Student First Name",
      "s.surname as  Student Last Name"
    )
    .where("s.country", country)
    .orderBy("s.id");
}

//Returns all Students with a specific username, used for login
function findByUsername(username) {
  return db("student as s").where("s.username", username);
}

//returns Student specific information with specific ID number.
function findProfile(id) {
  return db("student as s")
    .join("volunteer as v", "v.id", "s.volunteerId")
    .select(
      "s.id as ID Number",
      "s.username as Username",
      "s.forename as First Name",
      "s.surname as Last Name",
      "v.id as Teacher ID Number",
      "v.forename as Teacher First Name",
      "v.surname as Teacher Last Name",
      "s.country as Country"
    )
    .where("s.id", id);
}

//Used to register a new Student to the database
//WARNING DO NOT ADD MORE THAN ONE ADMIN FOR EACH COUNTRY, UNTESTED!!!!!
function register(person) {
  return db("student as s")
    .insert(person, "*")
    .then(([newUser]) => {
      return newUser;
    });
}
