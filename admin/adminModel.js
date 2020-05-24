const db = require("../data/dbConfig");

module.exports = {
  find,
  findBy,
  findByID,
  register,
};

function find() {
  return db("administrator");
}

function findBy(username) {
  return db("users").where({ username });
}

function findByID(id) {
  return db("users").where({ id }).first();
}

function register(person) {
  return db("users")
    .insert(person, "*")
    .then(([newUser]) => {
      return newUser;
    });
}
