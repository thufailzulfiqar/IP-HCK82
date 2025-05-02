const { hashPassword, comparePassword } = require("../helpers/bcrypt");

describe("bcrypt helpers", () => {
  it("should hash a password correctly", () => {
    const password = "mypassword";
    const hashedPassword = hashPassword(password);

    expect(hashedPassword).not.toBe(password);
    expect(typeof hashedPassword).toBe("string");
    expect(hashedPassword.length).toBeGreaterThan(0);
  });

  it("should compare a password correctly", () => {
    const password = "mypassword";
    const hashedPassword = hashPassword(password);

    const isMatch = comparePassword(password, hashedPassword);
    expect(isMatch).toBe(true);

    const isNotMatch = comparePassword("wrongpassword", hashedPassword);
    expect(isNotMatch).toBe(false);
  });
});
