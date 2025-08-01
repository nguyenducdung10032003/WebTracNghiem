const mongoose = require("mongoose");
const testSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    question: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 0 },
    level: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Test", testSchema, "tests");
