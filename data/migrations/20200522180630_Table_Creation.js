exports.up = function (knex) {
  return knex.schema
    .createTable("administrator", (tbl) => {
      tbl.increments();
      tbl.text("username", 128).unique().notNullable();
      tbl.text("password", 128).notNullable();
      tbl.text("forename", 128).notNullable();
      tbl.text("surname", 128).notNullable();
      tbl.text("country", 128).notNullable();
    })
    .createTable("volunteer", (tbl) => {
      tbl.increments();
      tbl.text("username", 128).unique().notNullable();
      tbl.text("password", 128).notNullable();
      tbl.text("forename", 128).notNullable();
      tbl.text("surname", 128).notNullable();
      tbl.text("country", 128).notNullable();
      tbl.integer("adminId", 128).unsigned().notNullable();
      //   .references("id")
      //   .inTable("administrator")
      //   .onUpdate("CASCADE")
      //   .onDelete("CASCADE");
    })
    .createTable("student", (tbl) => {
      tbl.increments();
      tbl.text("username", 128).unique().notNullable();
      tbl.text("password", 128).notNullable();
      tbl.text("forename", 128).notNullable();
      tbl.text("surname", 128).notNullable();
      tbl.text("country", 128).notNullable();
      tbl.integer("volunteerId", 128).unsigned().notNullable();
      // .references("id")
      // .inTable("volunteer")
      // .onUpdate("CASCADE")
      // .onDelete("CASCADE");
    })
    .createTable("lists", (tbl) => {
      tbl.increments();
      tbl.text("toDoListName", 128).notNullable();
      tbl.integer("adminId", 128).unsigned().notNullable();
      // .references("id")
      // .inTable("administrator")
      // .onUpdate("CASCADE")
      // .onDelete("CASCADE");
      tbl.integer("volunteerId", 128).unsigned().notNullable();
      // .references("id")
      // .inTable("volunteer")
      // .onUpdate("CASCADE")
      // .onDelete("CASCADE");
    })
    .createTable("items", (tbl) => {
      tbl.increments();
      tbl.integer("listId", 128).unsigned().notNullable();
      // .references("id")
      // .inTable("lists")
      // .onUpdate("CASCADE")
      // .onDelete("CASCADE");
      tbl.integer("itemId", 128).unsigned().notNullable();
      tbl.text("item", 128).notNullable();
      tbl.boolean("completed", 128).notNullable().defaultTo("false");
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("administrator")
    .dropTableIfExists("volunteer")
    .dropTableIfExists("student")
    .dropTableIfExists("lists")
    .dropTableIfExists("items");
};
