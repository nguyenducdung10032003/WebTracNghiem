const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getCorrectAnswer,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestionsByTestId,
} = require("../controllers/questionController");

router.get("/", getQuestions);
router.get("/questions", getQuestionsByTestId);

router.post("/answer", getCorrectAnswer);
router.post("/", addQuestion);

router.delete("/:id", deleteQuestion);

router.put("/:id", updateQuestion);

module.exports = router;
