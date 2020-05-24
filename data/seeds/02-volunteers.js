const bcrypt = require("bcryptjs");
const password = "test";
const hash = bcrypt.hashSync(password, 10);

exports.seed = function (knex) {
  return knex("volunteer")
    .truncate()
    .then(function () {
      return knex("volunteer").insert([
        {
          username: "TestVol",
          password: hash,
          forename: "test",
          surname: "test",
          country: "USA",
          adminId: 1,
        },
        {
          username: "jSmithVol",
          password: hash,
          forename: "Josh",
          surname: "Smith",
          country: "France",
          adminId: 2,
        },
        {
          username: "kNdiayeVol",
          password: hash,
          forename: "Kyle",
          surname: "Ndiaye",
          country: "China",
          adminId: 3,
        },
      ]);
    });
};
