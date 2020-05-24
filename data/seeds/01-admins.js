const bcrypt = require("bcryptjs");
const password = "test";
const hash = bcrypt.hashSync(password, 10);

exports.seed = function (knex) {
  return knex("administrator")
    .truncate()
    .then(function () {
      return knex("administrator").insert([
        {
          username: "Testmin",
          password: hash,
          forename: "test",
          surname: "test",
          country: "USA",
        },
        {
          username: "franceAdmin",
          password: hash,
          forename: "Tom",
          surname: "Brady",
          country: "France",
        },
        {
          username: "jDoeAdmin",
          password: hash,
          forename: "Jane",
          surname: "Doe",
          country: "China",
        },
      ]);
    });
};
