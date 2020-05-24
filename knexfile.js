require("dotenv").config();

const pgConnect = process.env.DATABASE_URL || {
  host: "localhost",
  database: "SchoolInTheCloudBackEnd",
  user: "postgres",
  password: process.env.pgpw,
  port: 5432,
};
module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./data/school.db3",
    },
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      },
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./data/migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      database: "my_db",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "pg",
    connection: pgConnect,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "./data/migrations",
      tableName: "knex_migrations",
    },
    seeds: {
      directory: "./data/seeds",
    },
  },
};
