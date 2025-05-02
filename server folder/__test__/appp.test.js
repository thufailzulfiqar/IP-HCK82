const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { signToken } = require("../helpers/jwt");
const axios = require("axios");

jest.mock("../models");
jest.mock("../helpers/jwt");
jest.mock("axios");

describe("App.js Branch Coverage Tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /login", () => {
    it("should return 400 if email is missing", async () => {
      const response = await request(app).post("/login").send({ password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Email is required");
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app).post("/login").send({ email: "test@example.com" });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Password is required");
    });

    it("should return 401 if user is not found", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "email/password is invalid");
    });

    it("should return 401 if password is invalid", async () => {
      const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };
      User.findOne.mockResolvedValue(mockUser);
      const comparePassword = jest.fn().mockReturnValue(false);

      const response = await request(app).post("/login").send({
        email: "test@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "email/password is invalid");
    });
  });

  describe("POST /register", () => {
    it("should return 400 if email is missing", async () => {
      const response = await request(app).post("/register").send({
        password: "password123",
        username: "testuser",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Email is required");
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app).post("/register").send({
        email: "test@example.com",
        username: "testuser",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Password is required");
    });

    it("should return 400 if username is missing", async () => {
      const response = await request(app).post("/register").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Username is required");
    });
  });

  describe("POST /fusion", () => {
    it("should return 400 if one or both characters are missing", async () => {
      const response = await request(app).post("/fusion").send({
        character1: {
          name: "Goku",
          race: "Saiyan",
          gender: "Male",
          affiliation: "Z Fighters",
          ki: 9000,
          maxKi: 15000,
          image: "https://example.com/goku.png",
        },
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error", "2 characters are required");
    });

    it("should return 500 if no image is generated", async () => {
      const mockResponse = {
        candidates: [
          {
            content: {
              parts: [],
            },
          },
        ],
      };

      axios.post.mockResolvedValue({ data: mockResponse });

      const response = await request(app).post("/fusion").send({
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
      expect(response.body).toHaveProperty("error", "No image generated");
    });
  });

  describe("GET /characters", () => {
    it("should return 500 if there is an error fetching characters", async () => {
      axios.get.mockRejectedValue(new Error("Internal Server Error"));

      const response = await request(app).get("/characters");

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty("error", "Failed to fetch characters");
    });
  });
});