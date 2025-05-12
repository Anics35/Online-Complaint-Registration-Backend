const express = require("express");
const authRouter = express.Router();
const { validateSignupData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 🔐 Signup Route
authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req); // Check required fields manually

    const { firstName, lastName, emailId, password, rollNumber, age, gender, role } = req.body;

    const existing = await User.findOne({ emailId });
    if (existing) throw new Error("User already exists with this email");

    const user = new User({
      firstName,
      lastName,
      emailId,
      password, // will be auto-hashed via pre-save middleware
      rollNumber,
      age,
      gender,
      role,
    });

    await user.save();
    res.status(201).send("User registered successfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// 🔑 Login Route
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await user.validatePassword(password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = user.getJWT();
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.send({ message: "Login successful", user });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// 🚪 Logout Route
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.send("Logout successful!");
});

module.exports = authRouter;
