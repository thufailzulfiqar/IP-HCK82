const errorHandler = require("../middlewares/errorHandler");

describe("Error Handler Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should handle SequelizeValidationError", () => {
    const err = {
      name: "SequelizeValidationError",
      errors: [{ message: "Validation error occurred" }],
    };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Validation error occurred" });
  });

  it("should handle BadRequest error", () => {
    const err = { name: "BadRequest", message: "Bad request error" };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Bad request error" });
  });

  it("should handle Unauthorized error", () => {
    const err = { name: "Unauthorized", message: "Unauthorized access" };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized access" });
  });

  it("should handle Forbidden error", () => {
    const err = { name: "Forbidden", message: "Access forbidden" };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access forbidden" });
  });

  it("should handle NotFound error", () => {
    const err = { name: "NotFound", message: "Resource not found" };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Resource not found" });
  });

  it("should handle generic errors", () => {
    const err = { name: "GenericError", message: "Something went wrong" };

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});