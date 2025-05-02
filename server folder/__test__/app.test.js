jest.mock("../middlewares/authentication", () =>
  jest.fn((req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Invalid Token" });
    }
    req.user = { id: 1, role: "Admin" };
    next();
  })
);

jest.mock("../middlewares/authorization", () => ({
  isAdmin: jest.fn((req, res, next) => {
    if (req.user.role === "Admin") return next();
    res.status(403).json({ message: "You're not authorized" });
  }),
}));

jest.mock("../helpers/bcrypt", () => ({
    hashPassword: jest.fn((password) => `hashed_${password}`),
    comparePassword: jest.fn(), // <== ini mock function
  }));

const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const axios = require("axios");
const { GoogleGenAI } = require("@google/genai");
const { OAuth2Client } = require("google-auth-library");
const { signToken } = require("../helpers/jwt");

jest.mock("@google/genai");

jest.mock("google-auth-library");

jest.mock("../helpers/jwt", () => ({
  signToken: jest.fn(() => "mockedAccessToken"),
}));
jest.mock("../models");

jest.mock("axios");

describe("POST /login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and access token for valid credentials", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      role: "User",
    };

    User.findOne.mockResolvedValue(mockUser);
    comparePassword.mockReturnValue(true);
    const mockToken = "mockedAccessToken";

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", mockToken);
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(comparePassword).toHaveBeenCalledWith(
      "password123",
      "hashedpassword"
    );
  });

  it("should return 400 if email is missing", async () => {
    const response = await request(app)
      .post("/login")
      .send({ password: "password123" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  it("should return 400 if password is missing", async () => {
    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  it("should return 401 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "email/password is invalid"
    );
  });

  it("should return 401 if password is invalid", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      password: "hashedpassword",
      role: "User",
    };

    User.findOne.mockResolvedValue(mockUser);
    comparePassword.mockReturnValue(false);

    const response = await request(app)
      .post("/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "email/password is invalid"
    );
  });
});

describe("POST /register", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and created user without password", async () => {
    const mockUser = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        email: "test@example.com",
        username: "testuser",
      }),
    };

    User.create.mockResolvedValue(mockUser);

    const response = await request(app).post("/register").send({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: 1,
      email: "test@example.com",
      username: "testuser",
    });
    expect(User.create).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    });
  });

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

  it("should return 500 if there is a server error", async () => {
    User.create.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app).post("/register").send({
      email: "test@example.com",
      password: "password123",
      username: "testuser",
    });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });
});

describe("DELETE /users/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and success message when user is deleted by an admin", async () => {
    const mockUser = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(),
    };

    User.findByPk.mockResolvedValue(mockUser);

    const response = await request(app)
      .delete("/users/1")
      .set("Authorization", "Bearer mockedAdminToken");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "User deleted successfully");
    expect(User.findByPk).toHaveBeenCalledWith("1");
    expect(mockUser.destroy).toHaveBeenCalled();
  });

  it("should return 404 if user is not found", async () => {
    User.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .delete("/users/999")
      .set("Authorization", "Bearer mockedAdminToken");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).delete("/users/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should return 500 if there is a server error", async () => {
    User.findByPk.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .delete("/users/1")
      .set("Authorization", "Bearer mockedAdminToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });
});

describe("PATCH /users/edit", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and updated user data when valid data is provided", async () => {
    const mockUser = {
      id: 1,
      email: "oldemail@example.com",
      username: "oldusername",
      password: "hashedpassword",
      save: jest.fn().mockResolvedValue(),
      toJSON: jest.fn().mockReturnValue({
        id: 1,
        email: "newemail@example.com",
        username: "newusername",
      }),
    };

    User.findByPk.mockResolvedValue(mockUser);

    const response = await request(app)
      .patch("/users/edit")
      .set("Authorization", "Bearer mockedAccessToken")
      .send({
        email: "newemail@example.com",
        username: "newusername",
        password: "newpassword123",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "User updated successfully"
    );
    expect(response.body.user).toEqual({
      id: 1,
      email: "newemail@example.com",
      username: "newusername",
    });
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockUser.email).toBe("newemail@example.com");
    expect(mockUser.username).toBe("newusername");
    expect(mockUser.password).not.toBe("newpassword123"); // Password should be hashed
  });

  it("should return 404 if user is not found", async () => {
    User.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .patch("/users/edit")
      .set("Authorization", "Bearer mockedAccessToken")
      .send({
        email: "newemail@example.com",
        username: "newusername",
        password: "newpassword123",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).patch("/users/edit").send({
      email: "newemail@example.com",
      username: "newusername",
      password: "newpassword123",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });

  it("should return 500 if there is a server error", async () => {
    User.findByPk.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .patch("/users/edit")
      .set("Authorization", "Bearer mockedAccessToken")
      .send({
        email: "newemail@example.com",
        username: "newusername",
        password: "newpassword123",
      });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal server error");
  });
});

describe("GET /characters", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and a list of characters when successful", async () => {
    const mockCharacters = [
      { id: 1, name: "Goku" },
      { id: 2, name: "Vegeta" },
    ];

    axios.get.mockResolvedValue({ data: mockCharacters });

    const response = await request(app)
      .get("/characters")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCharacters);
    expect(axios.get).toHaveBeenCalledWith(
      "https://dragonball-api.com/api/characters",
      { params: {} }
    );
  });

  it("should return 500 if there is an error fetching characters", async () => {
    axios.get.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .get("/characters")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Failed to fetch characters");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/characters");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

describe("GET /characters/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the character data when successful", async () => {
    const mockCharacter = { id: 1, name: "Goku", power: "Super Saiyan" };

    axios.get.mockResolvedValue({ data: mockCharacter });

    const response = await request(app)
      .get("/characters/1")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCharacter);
    expect(axios.get).toHaveBeenCalledWith(
      "https://dragonball-api.com/api/characters/1"
    );
  });

  it("should return 500 if there is an error fetching the character", async () => {
    axios.get.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .get("/characters/1")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Failed to fetch character");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/characters/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

describe("GET /planets", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and a list of planets when successful", async () => {
    const mockPlanets = [
      { id: 1, name: "Earth" },
      { id: 2, name: "Namek" },
    ];

    axios.get.mockResolvedValue({ data: mockPlanets });

    const response = await request(app)
      .get("/planets")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPlanets);
    expect(axios.get).toHaveBeenCalledWith(
      "https://dragonball-api.com/api/planets",
      { params: {} }
    );
  });

  it("should return 500 if there is an error fetching planets", async () => {
    axios.get.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .get("/planets")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Failed to fetch planets");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/planets");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

describe("GET /planets/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the planet data when successful", async () => {
    const mockPlanet = { id: 1, name: "Earth", description: "Home planet" };

    axios.get.mockResolvedValue({ data: mockPlanet });

    const response = await request(app)
      .get("/planets/1")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPlanet);
    expect(axios.get).toHaveBeenCalledWith(
      "https://dragonball-api.com/api/planets/1"
    );
  });

  it("should return 500 if there is an error fetching the planet", async () => {
    axios.get.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .get("/planets/1")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("error", "Failed to fetch planets");
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/planets/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

describe("GET /transformations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and a list of transformations when successful", async () => {
    const mockTransformations = [
      { id: 1, name: "Super Saiyan" },
      { id: 2, name: "Ultra Instinct" },
    ];

    axios.get.mockResolvedValue({ data: mockTransformations });

    const response = await request(app)
      .get("/transformations")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTransformations);
    expect(axios.get).toHaveBeenCalledWith(
      "https://dragonball-api.com/api/transformations"
    );
  });

  it("should return 500 if there is an error fetching transformations", async () => {
    axios.get.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .get("/transformations")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "Failed to fetch transformations"
    );
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/transformations");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

describe("GET /transformations/:id", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the transformation data when successful", async () => {
    const mockTransformation = {
      id: 1,
      name: "Super Saiyan",
      description: "A powerful transformation",
    };

    axios.get.mockResolvedValue({ data: mockTransformation });

    const response = await request(app)
      .get("/transformations/1")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTransformation);
    expect(axios.get).toHaveBeenCalledWith(
      "https://dragonball-api.com/api/transformations/1"
    );
  });

  it("should return 500 if there is an error fetching the transformation", async () => {
    axios.get.mockRejectedValue(new Error("Internal Server Error"));

    const response = await request(app)
      .get("/transformations/1")
      .set("Authorization", "Bearer mockedAccessToken");

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty(
      "error",
      "Failed to fetch transformations"
    );
  });

  it("should return 401 if no token is provided", async () => {
    const response = await request(app).get("/transformations/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid Token");
  });
});

describe("POST /fusion", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and the fusion image when input is valid", async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                inlineData: {
                  data: "mockedBase64ImageData",
                },
              },
            ],
          },
        },
      ],
    };

    GoogleGenAI.prototype.models = {
      generateContent: jest.fn().mockResolvedValue(mockResponse),
    };

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

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("image", "mockedBase64ImageData");
    expect(GoogleGenAI.prototype.models.generateContent).toHaveBeenCalled();
  });

  it("should return 400 if one or both characters are missing", async () => {
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
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "2 characters are required");
  });

  it("should return 500 if the AI service fails", async () => {
    GoogleGenAI.prototype.models = {
      generateContent: jest.fn().mockRejectedValue(new Error("AI service error")),
    };

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
    expect(GoogleGenAI.prototype.models.generateContent).toHaveBeenCalled();
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

    GoogleGenAI.prototype.models = {
      generateContent: jest.fn().mockResolvedValue(mockResponse),
    };

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
    expect(response.body).toHaveProperty("error", "No image generated");
    expect(GoogleGenAI.prototype.models.generateContent).toHaveBeenCalled();
  });

  
});

describe("POST /login-google", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new user and return access token if user does not exist", async () => {
    const mockGoogleToken = "mockGoogleToken";
    const mockPayload = {
      email: "newuser@example.com",
      name: "New User",
    };

    const mockTicket = {
      getPayload: jest.fn().mockReturnValue(mockPayload),
    };

    OAuth2Client.prototype.verifyIdToken = jest.fn().mockResolvedValue(mockTicket);
    User.findOne.mockResolvedValue(null); // Simulate user not found
    User.create.mockResolvedValue({
      id: 1,
      email: mockPayload.email,
      username: mockPayload.name,
    });
    signToken.mockReturnValue("mockedAccessToken");
    hashPassword.mockReturnValue("hashedRandomPassword");

    const response = await request(app).post("/login-google").send({
      googleToken: mockGoogleToken,
    });

    expect(OAuth2Client.prototype.verifyIdToken).toHaveBeenCalledWith({
      idToken: mockGoogleToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: mockPayload.email },
    });
    expect(User.create).toHaveBeenCalledWith({
      email: mockPayload.email,
      password: expect.any(String), // Random password is hashed
      username: mockPayload.name,
    });
    expect(signToken).toHaveBeenCalledWith({ id: 1 });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token", "mockedAccessToken");
  });
});