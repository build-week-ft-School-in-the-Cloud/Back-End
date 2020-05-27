const db = require("../data/dbConfig");

module.exports = {
  getAll,
  findByCountry,
  findByUsername,
  findProfile,
  register,
  update,
};

//Returns everything from a student perspective, which volunteers are teaching them
//Wish i could get it to display the info in a more streamlined way but it works
function getAll() {
  return (
    db("student as s")
      .leftJoin("volunteer as v", "v.id", "s.volunteerId")
      .select(
        //Volunteer info
        "v.id as VolunteerID",
        "v.username as TeacherUsername",
        "v.forename as TeacherFirstName",
        "v.surname as TeacherLastName",
        "v.country as TeacherCountry",
        //Student info
        "s.id as StudentID",
        "s.username as StudentUsername",
        "s.forename as StudentFirstName",
        "s.surname as  StudentLastName",
        "s.country as StudentCountry"
      )
      //sorted by student id number
      .orderBy("s.id")
  );
}

//Returns all Students in a specific country and displays their name and username
function findByCountry(country) {
  return (
    db("student as s")
      .leftJoin("volunteer as v", "v.id", "s.volunteerId")
      .select(
        //volunteer info
        "v.id as VolunteerID",
        "v.username as TeacherUsername",
        "v.forename as TeacherFirstName",
        "v.surname as TeacherLastName",
        "v.country as TeacherCountry",
        //student info
        "s.id as StudentID",
        "s.username as StudentUsername",
        "s.forename as StudentFirstName",
        "s.surname as  StudentLastName",
        "s.country as StudentCountry"
      )
      //filtered and sorted by student info
      .where("s.country", country)
      .orderBy("s.id")
  );
}

//Returns all Students with a specific username, used for login
function findByUsername(username) {
  return db("student as s").where("s.username", username);
}

//returns Student specific information with specific ID number.
function findProfile(id) {
  return (
    db("student as s")
      .join("volunteer as v", "v.id", "s.volunteerId")
      .select(
        //student info
        "s.id as IDNumber",
        "s.username as Username",
        "s.forename as FirstName",
        "s.surname as LastName",
        //volunteer info
        "v.id as TeacherIdNumber",
        "v.forename as TeacherFirstName",
        "v.surname as TeacherLastName",
        "s.country as Country"
      )
      //filtered by student id number
      .where("s.id", id)
  );
}

//Used to register a new Student to the database
function register(person) {
  return db("student as s")
    .insert(person, "*")
    .then(([newUser]) => {
      return newUser;
    });
}

//Edit Student Information
function update(changes, id) {
  return db("student as s")
    .select("s.forename as FirstName", "s.surname as LastName")
    .where("s.id", id)
    .update(changes);
}
