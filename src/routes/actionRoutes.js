const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  addAction,
  getComplaintActions,
} = require("../controllers/actionController");

const router = express.Router();

// Add a new action
router.post("/add", userAuth, addAction);

// Get all actions for a specific complaint
router.get("/get-action/:complaintId", userAuth, getComplaintActions);

module.exports = router;
