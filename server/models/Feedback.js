// models/Feedback.js
const mongoose = require("mongoose");

const FeedbackSchema = new mongoose.Schema(
  {
    interview: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    strengths: [
      {
        type: String,
      },
    ],
    areasForImprovement: [
      {
        type: String,
      },
    ],
    technicalAssessment: {
      type: String,
      required: true,
    },
    communicationAssessment: {
      type: String,
      required: true,
    },
    jobFitAssessment: {
      type: String,
      required: true,
    },
    recommendedResources: [
      {
        type: String,
      },
    ],
    detailedFeedback: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Feedback", FeedbackSchema);
