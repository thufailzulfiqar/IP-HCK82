const authentication = require("../middlewares/authentication");
const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

jest.mock("../helpers/jwt");
jest.mock("../models");

describe("Authentication Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw Unauthorized error if no authorization header is provided", async () => {
    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith({
      name: "Unauthorized",
      message: "Invalid Token",
    });
  });

  it("should throw Unauthorized error if token format is invalid", async () => {
    req.headers.authorization = "InvalidTokenFormat";

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith({
      name: "Unauthorized",
      message: "Invalid Token",
    });
  });

  it("should throw Unauthorized error if token is invalid", async () => {
    req.headers.authorization = "Bearer invalidToken";
    verifyToken.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith({
      name: "Unauthorized",
      message: "Invalid Token",
    });
  });

  it("should throw Unauthorized error if user is not found", async () => {
    req.headers.authorization = "Bearer validToken";
    verifyToken.mockReturnValue({ id: 1 });
    User.findByPk.mockResolvedValue(null);

    await authentication(req, res, next);

    expect(next).toHaveBeenCalledWith({
      name: "Unauthorized",
      message: "Invalid Token",
    });
  });

  it("should call next and attach user to req if token and user are valid", async () => {
    req.headers.authorization = "Bearer validToken";
    verifyToken.mockReturnValue({ id: 1 });
    User.findByPk.mockResolvedValue({ id: 1, role: "User" });

    await authentication(req, res, next);

    expect(req.user).toEqual({ id: 1, role: "User" });
    expect(next).toHaveBeenCalled();
  });
});