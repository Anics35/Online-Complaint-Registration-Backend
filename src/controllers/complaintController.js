const Complaint = require("../models/complaintSchema");
const ComplaintAction = require("../models/action");

// Submit a new complaint
const submitComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const attachments = req.files?.map(file => ({
      url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    })) || [];

    const complaint = new Complaint({
      title,
      description,
      category,
      submittedBy: req.user._id,
      attachments,
    });

    await complaint.save();
    return res.status(201).send("Complaint submitted successfully");
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
};

// Get complaints with actions
const getComplaints = async (req, res) => {
  try {
    const filter = req.user.role === "student" ? { submittedBy: req.user._id } : {};

    const complaints = await Complaint.find(filter)
      .populate("submittedBy", "firstName rollNumber role")
      .lean();

    const complaintIds = complaints.map(c => c._id);

    const actions = await ComplaintAction.find({ complaintId: { $in: complaintIds } })
      .populate("actionTakenBy", "firstName role")
      .lean();

    const actionsMap = actions.reduce((acc, action) => {
      const id = action.complaintId.toString();
      if (!acc[id]) acc[id] = [];
      acc[id].push(action);
      return acc;
    }, {});

    const complaintsWithActions = complaints.map(complaint => ({
      ...complaint,
      actions: actionsMap[complaint._id.toString()] || []
    }));

    return res.status(200).send(complaintsWithActions);
  } catch (err) {
    return res.status(400).send("ERROR: " + err.message);
  }
};

// Update complaint status and add action log

const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, note, meeting } = req.body;

    if (req.user.role === "student")
      throw new Error("Unauthorized: Only Panel/Admin can update status");

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) throw new Error("Complaint not found");

    complaint.status = status;
    await complaint.save();

  const meetingDetails = meeting && meeting.scheduled
  ? {
      scheduled: true,
      datetime: new Date(meeting.datetime),
      location: meeting.location || "",
      note: meeting.note || ""
    }
  : {
      scheduled: false,
      datetime: null,
      location: "",
      note: ""
    };

    const actionData = {
      complaintId: complaint._id,
      status,
      actionTakenBy: req.user._id,
      remarks: `Status changed to '${status}' by ${req.user.role}`,
      note,
      meetingDetails,
    };

    await ComplaintAction.create(actionData);

    res.status(200).send("Complaint status updated and action logged");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};


module.exports = {
  submitComplaint,
  getComplaints,
  updateComplaintStatus,
};
