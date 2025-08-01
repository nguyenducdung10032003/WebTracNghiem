const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: {
      type: [Number],
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    category: { type: String, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Question", questionSchema, "questions");
