const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
     return res.status(401).send("Please Login!");
    }

    // Match secret with your user model method
    const decoded = jwt.verify(token, "SECRET_KEY"); // Make sure this matches the key used in user.getJWT()

    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user; // attach user to request for next handlers
    next();
  } catch (err) {
    res.status(401).json({ error: "Authentication failed: " + err.message });
  }
};

module.exports = { userAuth };
