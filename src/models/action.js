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
      default: "",
    },
    attachmentUrl: {
      type: String,
    },
    meeting: {
      scheduled: { type: Boolean, default: false },
      date: { type: Date },
      note: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ComplaintAction", complaintActionSchema);
