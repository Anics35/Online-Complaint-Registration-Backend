const express = require("express");
const { userAuth } = require("../middleware/auth");
const Complaint = require("../models/complaintSchema");

const router = express.Router();

// Request to reopen/resubmit a resolved complaint
router.post("/reopen/:complaintId", userAuth, async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { reason } = req.body;

    const complaint = await Complaint.findById(complaintId);

    if (!complaint) throw new Error("Complaint not found");
    if (complaint.status !== "Resolved") throw new Error("Only resolved complaints can be reopened");

    // Reset status and add reason in remarks
    complaint.status = "Reopened";
    complaint.remarks = reason || "Requested to reopen";
    await complaint.save();

    res.status(200).send("Complaint reopened successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = router;
