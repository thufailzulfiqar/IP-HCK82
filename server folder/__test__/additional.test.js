const request = require("supertest");
const app = require("../app");
const { User } = require("../models");

jest.mock("../models");
jest.mock("../middlewares/authentication", () =>
    jest.fn((req, res, next) => {
      const authHeader = req.headers["authorization"];
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid Token" });
      }
      req.user = { id: 1, role: "Admin" }; // Simulasikan pengguna admin
      next();
    })
  );
jest.mock("@google/genai", () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: jest.fn().mockRejectedValue(new Error("AI service error")),
    },
  })),
}));

describe("Additional Tests for Coverage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle unexpected errors in DELETE /users/:id", async () => {
    User.findByPk.mockRejectedValue(new Error("Unexpected Error"));

    const response = await request(app)
      .delete("/users/1")
      .set("Authorization", "Bearer mockedAdminToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });

  it("should handle invalid input in POST /register", async () => {
    const response = await request(app).post("/register").send({
      email: "invalid-email",
      password: "short",
      username: "",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });

  it("should handle invalid token in GET /characters", async () => {
    const response = await request(app).get("/characters");
  
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should handle missing fields in PATCH /users/edit", async () => {
    const response = await request(app)
      .patch("/users/edit")
      .set("Authorization", "Bearer mockedAccessToken")
      .send({
        email: "",
        username: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", expect.any(String));
  });

  it("should handle unexpected errors in POST /fusion", async () => {
    const response = await request(app)
      .post("/fusion")
      .send({
        character1: {
          name: "Goku",
          race: "Saiyan",
          gender: "Male",
          affiliation: "Z Fighters",
          ki: 9000,
          maxKi: 15000,
          image: "https://example.com/goku.png",
        },
        character2: {
          name: "Vegeta",
          race: "Saiyan",
          gender: "Male",
          affiliation: "Z Fighters",
          ki: 8500,
          maxKi: 14000,
          image: "https://example.com/vegeta.png",
        },
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Internal server error");
  });
});

const { isAdmin } = require("../middlewares/authorization");

describe("Middleware Tests", () => {
  it("should allow access for admin users", () => {
    const req = { user: { role: "Admin" } };
    const res = {};
    const next = jest.fn();

    isAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should deny access for non-admin users", () => {
    const req = { user: { role: "User" } }; // Simulasikan pengguna dengan role "User"
    const res = {
      status: jest.fn().mockReturnThis(), // Mock fungsi `status` untuk chaining
      json: jest.fn(), // Mock fungsi `json`
    };
    const next = jest.fn(); // Mock fungsi `next`
  
    isAdmin(req, res, next); // Panggil middleware
  
    // Pastikan middleware mengembalikan status 403
    expect(res.status).toHaveBeenCalledWith(403);
    // Pastikan middleware mengembalikan pesan error yang benar
    expect(res.json).toHaveBeenCalledWith({ message: "You're not authorized" });
    // Pastikan fungsi `next` tidak dipanggil
    expect(next).not.toHaveBeenCalled();
  });
});