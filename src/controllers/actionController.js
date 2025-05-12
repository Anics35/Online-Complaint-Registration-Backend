const ComplaintAction = require("../models/action");
const Complaint = require("../models/complaintSchema");

// Add action to a complaint
const addAction = async (req, res) => {
  try {
    const { complaintId, status, remarks, attachmentUrl } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    // Update the status of the complaint
    complaint.status = status;
    await complaint.save();

    const action = new ComplaintAction({
      complaintId,
      actionTakenBy: req.user._id,
      status,
      remarks,
      attachmentUrl,
    });

    await action.save();
    res.status(200).send("Action recorded successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

// Get all actions related to a complaint
const getComplaintActions = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const actions = await ComplaintAction.find({ complaintId }).populate("actionTakenBy", "firstName role");

    res.status(200).send(actions);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  addAction,
  getComplaintActions,
};
