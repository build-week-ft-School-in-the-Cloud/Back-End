const supertest = require("supertest");
const router = require("../api/server");
const db = require("../data/dbConfig");

beforeEach(() => {
  return db.migrate
    .rollback()
    .then(() => db.migrate.latest())
    .then(() => db.seed.run());
});

describe("Student Endpoints", () => {
  it("can run the tests", () => {
    expect(true).toBeTruthy();
  });

  describe("GET /api/student", () => {
    it("should return http status code 200 OK", () => {
      return (
        supertest(router)
          .get("/api/student")
          // .expect(200) // from supertest
          .then((response) => {
            // from jest
            expect(response.status).toBe(200);
          })
      );
    });
    it("should return welcome message", () => {
      return supertest(router)
        .get("/api/student")
        .then((response) => {
          expect(response.body).toEqual(
            "Navigate to /register if you dont have an account or /login if you have an account"
          );
          expect(response.body).toBeDefined();
        });
    });
  });

  describe("POST /api/student/register", () => {
    it("should return http status code 201 Created", async () => {
      const res = await supertest(router).post("/api/student/register").send({
        username: "jestTest",
        password: "test",
        forename: "Jest",
        surname: "Testsuite",
        country: "USA",
        volunteerId: 1,
      });
      expect(res.status).toBe(201);
      expect(res.type).toBe("application/json");
    });
  });

  describe("POST /api/student/login", () => {
    it("should return http status code 200 OK", async () => {
      const login = await supertest(router).post("/api/student/login").send({
        username: "TestStu",
        password: "test",
      });
      expect(login.status).toBe(200);
      expect(login.type).toBe("application/json");
    });
  });

  describe("GET api/student/users", () => {
    it("GET /api/student/users", async () => {
      const login = await supertest(router)
        .post("/api/student/login")
        .send({ username: "TestStu", password: "test" });

      const res = await supertest(router)
        .get("/api/student/users")
        .set("authorization", login.body.token);
      expect(res.status).toBe(200);
      expect(res.type).toBe("application/json");
    });
  });

  describe("GET api/student/profile", () => {
    it("GET /api/student/profile", async () => {
      const login = await supertest(router)
        .post("/api/student/login")
        .send({ username: "TestStu", password: "test" });

      const res = await supertest(router)
        .get("/api/student/profile")
        .set("authorization", login.body.token);
      expect(res.status).toBe(200);
      expect(res.type).toBe("application/json");
    });
  });

  describe("GET api/student/profile/country", () => {
    it("GET /api/student/profile/country", async () => {
      const login = await supertest(router)
        .post("/api/student/login")
        .send({ username: "TestStu", password: "test" });

      const res = await supertest(router)
        .get("/api/student/profile/country")
        .set("authorization", login.body.token);
      expect(res.status).toBe(200);
      expect(res.type).toBe("application/json");
    });
  });

  describe("PUT api/student/profile/edit", () => {
    it("PUT /api/student/profile/edit", async () => {
      const login = await supertest(router)
        .post("/api/student/login")
        .send({ username: "TestStu", password: "test" });

      const res = await supertest(router)
        .put("/api/student/profile/edit")
        .set("authorization", login.body.token)
        .send({ forename: "Jester", surname: "of The King" });

      expect(res.status).toBe(201);
      expect(res.type).toBe("application/json");
    });
  });
});
