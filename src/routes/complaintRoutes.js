const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();
const { userAuth } = require("../middleware/auth");
const {
  submitComplaint,
  getComplaints,
  updateComplaintStatus,
} = require("../controllers/complaintController");

// Submit a new complaint
router.post("/submit", userAuth, upload.array("attachments", 3) , submitComplaint);

// Get all complaints (admin/staff) or own (student)
router.get("/list", userAuth, getComplaints);

// Update complaint status (admin/staff only)
router.put("/update/:complaintId", userAuth, updateComplaintStatus);

module.exports = router;
