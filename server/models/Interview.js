// models/Interview.js
const mongoose = require("mongoose");

const InterviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobDescription: {
      type: String,
      required: [true, "Job description is required"],
    },
    resumeUrl: {
      type: String,
      required: [true, "Resume URL is required"],
    },
    resumeText: {
      type: String,
      required: [true, "Resume text content is required"],
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    transcript: [
      {
        role: {
          type: String,
          enum: ["interviewer", "candidate"],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // in seconds
    },
  },
  {
    timestamps: true,
  }
);

// Calculate interview duration when completed
InterviewSchema.pre("save", function (next) {
  if (this.status === "completed" && this.endTime && !this.duration) {
    this.duration = Math.round((this.endTime - this.startTime) / 1000);
  }
  next();
});

module.exports = mongoose.model("Interview", InterviewSchema);
