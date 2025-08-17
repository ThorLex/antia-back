const request = require("supertest");
const app = require("../server");

describe("Notification Routes", () => {
  it("should fetch all notifications", async () => {
    const res = await request(app)
      .get("/notifications")
      .set("Authorization", "Bearer valid_token");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should mark a notification as read", async () => {
    const res = await request(app)
      .patch("/notifications/notification_id/read")
      .set("Authorization", "Bearer valid_token");
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Notification marked as read");
  });
});
