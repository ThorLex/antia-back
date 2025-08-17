const request = require("supertest");
const app = require("../server");

describe("Auth Routes", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should login an existing user", async () => {
    const res = await request(app).post("/auth/login").send({
      username: "testuser",
      password: "password123",
    });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("token");
  });
});
