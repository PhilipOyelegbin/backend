const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Updated to bcryptjs
const { User } = require("./model");

const secretKey = process.env.SECRET_KEY;

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
}

async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

async function generateToken(user) {
  const payload = { id: user.id, role: user.role };
  return jwt.sign(payload, secretKey, { expiresIn: "4h" });
}

async function authenticate(email, password) {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    throw new Error("Invalid email or password");
  }
  return generateToken(user);
}

module.exports = { authenticate, generateToken, hashPassword, verifyPassword };
