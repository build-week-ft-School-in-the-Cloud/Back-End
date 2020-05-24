exports.seed = function (knex) {
  return knex("lists")
    .truncate()
    .then(function () {
      return knex("lists").insert([
        {
          toDoListName: "Take Attendance",
          adminId: 1,
          volunteerId: 1,
        },
        {
          toDoListName: "Take Attendance",
          adminId: 2,
          volunteerId: 2,
        },
        {
          toDoListName: "Take Attendance",
          adminId: 3,
          volunteerId: 3,
        },
        {
          toDoListName: "Teach Quantum Physics",
          adminId: 1,
          volunteerId: 2,
        },
        {
          toDoListName: "Physical Education",
          adminId: 3,
          volunteerId: 1,
        },
      ]);
    });
};
