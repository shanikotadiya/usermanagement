const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const generateEmailVerificationToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyEmailVerificationToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired verification token");
  }
};

const generateUserAuthToken = (userId, email, role) => {
  const payload = { id: userId, email: email, role: role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyUserAuthToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired authentication token");
  }
};

module.exports = {
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generateUserAuthToken,
  verifyUserAuthToken,
};
