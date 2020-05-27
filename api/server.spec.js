const supertest = require("supertest");
const server = require("./server.js");

describe("BASE URL", () => {
  it("can run the tests", () => {
    expect(true).toBeTruthy();
  });

  describe("GET /", () => {
    it("should return http status code 200 OK", () => {
      return (
        supertest(server)
          .get("/")
          // .expect(200) // from supertest
          .then((response) => {
            // from jest
            expect(response.status).toBe(200);
          })
      );
    });
    it("should return welcome message", () => {
      return supertest(server)
        .get("/")
        .then((response) => {
          expect(response.body).toEqual("Server starts here, Navigate to /api");
          expect(response.body).toBeDefined();
        });
    });
  });

  describe("GET /api", () => {
    it("should return http status code 200 OK", () => {
      return (
        supertest(server)
          .get("/api")
          // .expect(200) // from supertest
          .then((response) => {
            // from jest
            expect(response.status).toBe(200);
          })
      );
    });
    it("should return welcome message", () => {
      return supertest(server)
        .get("/api")
        .then((response) => {
          expect(response.body).toEqual(
            "Navigate to /admin, /volunteer, or /student"
          );
          expect(response.body).toBeDefined();
        });
    });
  });
});
