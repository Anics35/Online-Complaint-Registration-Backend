const mongoose = require("mongoose");

const complaintActionSchema = new mongoose.Schema(
  {
    complaintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
    },
    actionTakenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "under review", "resolved", "rejected"],
    },
    note: {
      type: String,
      default: "",
    },
    remarks: {
      type: String,
    },
    attachmentUrl: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ComplaintAction", complaintActionSchema);
