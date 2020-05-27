exports.up = function (knex) {
  return knex.schema
    .table("volunteer", (tbl) => {
      tbl.string("availible_times");
    })
    .table("student", (tbl) => {
      tbl.string("availible_times");
    });
  //create table morning afteroon evening
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("administrator")
    .dropTableIfExists("volunteer")
    .dropTableIfExists("student")
    .dropTableIfExists("lists")
    .dropTableIfExists("items");
};
