const mongoose = require("mongoose");

const testHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Test",
    required: true,
  },
  score: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeSpent: { type: Number, required: true },
  userName: { type: String, required: true },
  testTitle: { type: String, required: true },
  completedAt: { type: Date, default: Date.now }
},{timestamps: true});

module.exports = mongoose.model("TestHistory", testHistorySchema, "test_history");
