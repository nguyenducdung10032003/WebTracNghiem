const express = require("express");
const router = express.Router();
const {
  getTestById,
  addTest,
  deleteTest,
  updateTest,
  addQuestionToTest,
  deleteQuestionToTest,
} = require("../controllers/testController");

router.get("/", getTestById);

router.post("/", addTest);

router.delete("/:id", deleteTest);

router.put("/:id", updateTest);
router.put("/questions/:id", addQuestionToTest);
router.put("/question/:id", deleteQuestionToTest);
module.exports = router;
