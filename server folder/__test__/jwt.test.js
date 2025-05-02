const { signToken, verifyToken } = require("../helpers/jwt");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("JWT Helper Tests", () => {
  const mockPayload = { id: 1, email: "test@example.com", role: "User" };
  const mockToken = "mocked.jwt.token";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a valid JWT token using signToken", () => {
    jwt.sign.mockReturnValue(mockToken);

    const token = signToken(mockPayload);

    expect(jwt.sign).toHaveBeenCalledWith(mockPayload, process.env.JWT_SECRET);
    expect(token).toBe(mockToken);
  });

  it("should verify a valid JWT token using verifyToken", () => {
    jwt.verify.mockReturnValue(mockPayload);

    const payload = verifyToken(mockToken);

    expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
    expect(payload).toEqual(mockPayload);
  });

  it("should throw an error if verifyToken fails", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    expect(() => verifyToken(mockToken)).toThrow("Invalid token");
  });
});