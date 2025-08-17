const request = require("supertest");
const app = require("../server");

describe("History Routes", () => {
  it("should fetch all history entries", async () => {
    const res = await request(app)
      .get("/history")
      .set("Authorization", "Bearer valid_token");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should add a history entry", async () => {
    const res = await request(app)
      .post("/history")
      .send({ action: "Test Action", timestamp: new Date().toISOString() })
      .set("Authorization", "Bearer valid_token");
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe("History entry added successfully");
  });
});
