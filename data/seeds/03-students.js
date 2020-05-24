const bcrypt = require("bcryptjs");
const password = "test";
const hash = bcrypt.hashSync(password, 10);

exports.seed = function (knex) {
  return knex("student")
    .truncate()
    .then(function () {
      return knex("student").insert([
        {
          username: "TestStu",
          password: hash,
          forename: "test",
          surname: "test",
          country: "USA",
          volunteerId: 1,
        },
        {
          username: "kBristolStudent",
          password: hash,
          forename: "Key",
          surname: "Bristol",
          country: "USA",
          volunteerId: 1,
        },
        {
          username: "sJobsStudent",
          password: hash,
          forename: "Steve",
          surname: "Jobs",
          country: "USA",
          volunteerId: 1,
        },
        {
          username: "jSmithStudent",
          password: hash,
          forename: "Josh",
          surname: "Smith",
          country: "France",
          volunteerId: 2,
        },
        {
          username: "zWeiStudent",
          password: hash,
          forename: "Zhang",
          surname: "Wei",
          country: "China",
          volunteerId: 3,
        },
      ]);
    });
};
