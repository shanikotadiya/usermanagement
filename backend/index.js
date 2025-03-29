const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const User = require("./schemas/userschema");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./lib/db");
const jwt = require("jsonwebtoken");
const {
  sendVerificationEmail,
  verifyEmail,
} = require("./services/emailVerify");

const   {generateUserAuthToken, verifyUserAuthToken} = require("./services/tokenService");
const app = express();
app.use(bodyParser.json());
app.use(cors());

dotenv.config();
connectDB();

app.post("/user-register", async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    await sendVerificationEmail(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user: " + error.message });
  }
});

app.get("/verify-email", async (req, res) => {
  try {
    await verifyEmail(req.query, res);    
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!user.verified) {
      return res
        .status(400)
        .json({ message: "Email not verified. Please verify your email." });
    }
    if (user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "You are not allowed to login from here" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    const payload = { id: user._id, email: user.email, role: user.role };
  
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ message: "Admin login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in: " + error.message });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
