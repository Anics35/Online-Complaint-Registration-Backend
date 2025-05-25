const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
    },
   category: {
  type: String,
  enum: [
    "academic issue",
    "lab facility",
    "classroom facility",
    "faculty behavior",
    "non-teaching staff",
    "course registration",
    "exam/grading",
    "others"
  ],
  required: true,
},

    status: {
      type: String,
      enum: ["pending", "under review", "in-progress","resolved", "rejected"],
      default: "pending",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    resolvedAt: {
      type: Date,
    },
    note: {
      type: String,
    },
    remarks: {
      type: String,
    },
    visibility: {
      type: String,
      enum: ["private", "public"],
      default: "private",
    },

    
    attachments: [
      {
        url: {
          type: String,
          validate(value) {
            if (value && !/^https?:\/\//.test(value)) {
              throw new Error("Attachment URL must be valid");
            }
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Complaint", complaintSchema);
