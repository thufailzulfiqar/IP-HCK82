const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

jest.mock("fs");
jest.mock("sequelize");

describe("Models Index", () => {
  const mockConfig = {
    database: "test_db",
    username: "test_user",
    password: "test_password",
    use_env_variable: null,
  };

  let SequelizeMock;

  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = "test";
    jest.mock("../config/config.json", () => ({
      test: mockConfig,
    }));

    SequelizeMock = jest.fn();
    Sequelize.mockImplementation(() => ({
      define: jest.fn(),
      authenticate: jest.fn(),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize Sequelize with config values", () => {
    const db = require("../models");

    expect(Sequelize).toHaveBeenCalledWith(
      mockConfig.database,
      mockConfig.username,
      mockConfig.password,
      mockConfig
    );
    expect(db.sequelize).toBeDefined();
  });

  it("should initialize Sequelize with environment variable if use_env_variable is set", () => {
    mockConfig.use_env_variable = "DATABASE_URL";
    process.env.DATABASE_URL = "mocked_database_url";

    const db = require("../models");

    expect(Sequelize).toHaveBeenCalledWith("mocked_database_url", mockConfig);
    expect(db.sequelize).toBeDefined();
  });

  it("should load all models in the directory", () => {
    fs.readdirSync.mockReturnValue(["user.js", "post.js"]);

    jest.mock("../models/user.js", () => jest.fn(() => ({})), { virtual: true });
    jest.mock("../models/post.js", () => jest.fn(() => ({})), { virtual: true });

    const db = require("../models");

    expect(fs.readdirSync).toHaveBeenCalledWith(expect.stringContaining("models"));
    expect(db.User).toBeDefined();
    expect(db.Post).toBeDefined();
  });

  it("should call associate method if it exists", () => {
    const mockAssociate = jest.fn();
    const mockModel = jest.fn(() => ({
      associate: mockAssociate,
    }));

    jest.mock("../models/user.js", () => mockModel, { virtual: true });
    jest.mock("../models/post.js", () => mockModel, { virtual: true });

    const db = require("../models");

    expect(mockAssociate).toHaveBeenCalledWith(db);
  });

  it("should initialize Sequelize with environment variable if use_env_variable is set", () => {
    mockConfig.use_env_variable = "DATABASE_URL";
    process.env.DATABASE_URL = "mocked_database_url";
  
    const db = require("../models");
  
    expect(Sequelize).toHaveBeenCalledWith("mocked_database_url", mockConfig);
    expect(db.sequelize).toBeDefined();
  });
  
  it("should initialize Sequelize with config values if use_env_variable is not set", () => {
    mockConfig.use_env_variable = null;
  
    const db = require("../models");
  
    expect(Sequelize).toHaveBeenCalledWith(
      mockConfig.database,
      mockConfig.username,
      mockConfig.password,
      mockConfig
    );
    expect(db.sequelize).toBeDefined();
  });

  it("should not load files that do not match the filter criteria", () => {
    fs.readdirSync.mockReturnValue([
      "user.js", // valid model file
      "post.js", // valid model file
      "README.md", // invalid file
      "index.js", // invalid file
      "user.test.js", // invalid test file
    ]);
  
    jest.mock("../models/user.js", () => jest.fn(() => ({})), { virtual: true });
    jest.mock("../models/post.js", () => jest.fn(() => ({})), { virtual: true });
  
    const db = require("../models");
  
    expect(fs.readdirSync).toHaveBeenCalledWith(expect.stringContaining("models"));
    expect(db.User).toBeDefined();
    expect(db.Post).toBeDefined();
    expect(db.README).toBeUndefined(); // README.md should not be loaded
    expect(db.index).toBeUndefined(); // index.js should not be loaded
    expect(db["user.test"]).toBeUndefined(); // user.test.js should not be loaded
  });
});