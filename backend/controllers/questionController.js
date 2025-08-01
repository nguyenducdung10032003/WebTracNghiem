const Question = require("../models/Question");
const Test = require("../models/Test");
const mongoose = require("mongoose");

//lấy tất cả câu hỏi
const getQuestions = async (req, res) => {
  try {
    const { testId, search, category, level } = req.query;
    let filter = {};
    if (testId) {
      filter.testId = testId;
    }
    if (category) {
      filter.category = category;
    }
    if (level) {
      filter.level = level;
    }
    if (search) {
      filter.question = { $regex: search, $options: "i" };
    }
    const questions = await Question.find(filter);
    const total = await Question.countDocuments(questions);
    res.json({ questions, total });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getQuestionsByTestId = async (req, res) => {
  try {
    const { testId } = req.query;

    if (!testId || !mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({ error: "testId không hợp lệ" });
    }

    const test = await Test.findById(testId).populate("questions");

    if (!test) {
      return res.status(404).json({ error: "Không tìm thấy bài thi" });
    }

    return res.status(200).json({
      testTitle: test.title,
      questions: test.questions,
    });
  } catch (error) {
    console.error("Lỗi lấy câu hỏi theo testId:", error);
    return res.status(500).json({ error: "Lỗi server" });
  }
};
const getCorrectAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;

    if (!questionId || !Array.isArray(answer)) {
      return res.status(400).json({
        message: "Missing or invalid questionId or answer",
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        message: "Question not found",
      });
    }

    const isCorrect =
      Array.isArray(question.correctAnswer) &&
      question.correctAnswer.length === answer.length &&
      question.correctAnswer.every((val) => answer.includes(val));

    return res.json({
      questionId,
      isCorrect,
      correctAnswer: question.correctAnswer,
      message: isCorrect ? "Correct!" : "Wrong answer!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// POST /api/questions - Add new question
const addQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, level, category, testId } =
      req.body;

    // 🔍 Input validation
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Câu hỏi không hợp lệ.",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: "Phải có ít nhất 2 lựa chọn (options).",
      });
    }

    if (
      !Array.isArray(correctAnswer) ||
      correctAnswer.length === 0 ||
      correctAnswer.some(
        (index) =>
          typeof index !== "number" || index < 0 || index >= options.length
      )
    ) {
      return res.status(400).json({
        error: "Danh sách chỉ số đáp án đúng (correctAnswer) không hợp lệ.",
      });
    }

    const validLevels = ["beginner", "intermediate", "advanced"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: "Level không hợp lệ.",
      });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({
        error: "Category không hợp lệ.",
      });
    }

    // Optional: kiểm tra định dạng testId nếu có
    if (testId && !testId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "testId không hợp lệ.",
      });
    }

    //Tạo câu hỏi mới
    const newQuestion = new Question({
      question,
      options,
      correctAnswer,
      level,
      category,
    });

    await newQuestion.save();

    return res.status(201).json({
      message: "Thêm câu hỏi thành công",
      question: newQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi server khi thêm câu hỏi.",
    });
  }
};

//update question
const updateQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(404).json({
        error: "Invalid ID format",
      });
    }
    const existQuestion = await Question.findById(questionId);
    if (!existQuestion) {
      return res.status(400).json({
        error: "Không có câu hỏi phù hợp",
      });
    }
    const { question, options, correctAnswer, level, category, testId } =
      req.body;
    // 🔍 Input validation
    if (!question || typeof question !== "string") {
      return res.status(400).json({
        error: "Câu hỏi không hợp lệ.",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        error: "Phải có ít nhất 2 lựa chọn (options).",
      });
    }

    if (
      !Array.isArray(correctAnswer) ||
      correctAnswer.length === 0 ||
      correctAnswer.some(
        (index) =>
          typeof index !== "number" || index < 0 || index >= options.length
      )
    ) {
      return res.status(400).json({
        error: "Danh sách chỉ số đáp án đúng (correctAnswer) không hợp lệ.",
      });
    }

    const validLevels = ["beginner", "intermediate", "advanced"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: "Level không hợp lệ.",
      });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({
        error: "Category không hợp lệ.",
      });
    }

    // Optional: kiểm tra định dạng testId nếu có
    if (testId && !testId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        error: "testId không hợp lệ.",
      });
    }

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      {
        question,
        options,
        correctAnswer,
        level,
        category,
        testId,
      },
      {
        new: true,
      }
    );
    return res.status(201).json({
      message: "Cập nhật câu hỏi thành công",
      question: updatedQuestion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi server khi Cập nhật câu hỏi.",
    });
  }
};

//delete question
const deleteQuestion = async (req, res) => {
  try {
    const questionId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(404).json({
        error: "Invalid ID format",
      });
    }
    const deleteQuestion = await Question.findById(questionId);
    if (!deleteQuestion) {
      return res.status(400).json({
        error: "Không có câu hỏi phù hợp",
      });
    }
    await Question.findByIdAndDelete(questionId);

    await Test.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );
    return res.status(200).json({
      message: "Xóa câu hỏi thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi server khi xóa bài kiểm tra",
    });
  }
};
module.exports = {
  getQuestions,
  getCorrectAnswer,
  addQuestion,
  deleteQuestion,
  updateQuestion,
  getQuestionsByTestId,
};
