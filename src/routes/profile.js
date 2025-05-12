const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/user");

const router = express.Router();

// 🔹 Get logged-in user's profile
router.get("/me", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// 🔹 Update profile (name, role, rollNumber)
router.put("/update", userAuth, async (req, res) => {
  try {
    const { firstName, lastName, role, rollNumber } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) throw new Error("User not found");

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.role = role || user.role;
    user.rollNumber = rollNumber || user.rollNumber;

    await user.save();

    res.status(200).send("Profile updated successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
