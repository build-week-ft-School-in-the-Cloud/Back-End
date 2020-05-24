exports.seed = function (knex) {
  return knex("items")
    .truncate()
    .then(function () {
      return knex("items").insert([
        {
          listId: 1,
          itemId: 1,
          item: "Spell names correctly",
          completed: false,
        },
        {
          listId: 1,
          itemId: 2,
          item: "Pretend to have trouble reading ethnic names",
          completed: false,
        },
        {
          listId: 2,
          itemId: 1,
          item: "Spell names correctly",
          completed: false,
        },
        {
          listId: 2,
          itemId: 1,
          item: "Spell names correctly",
          completed: false,
        },
        {
          listId: 4,
          itemId: 1,
          item: "Go over Basic Science",
          completed: false,
        },
      ]);
    });
};
