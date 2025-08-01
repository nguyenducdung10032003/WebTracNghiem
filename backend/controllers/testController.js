const Test = require("../models/Test");
const mongoose = require("mongoose");

//get test
const getTestById = async (req, res) => {
  try {
    const { testId, search } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const filter = {};
    if (testId) {
      const test = await Test.findById(testId);

      if (!test) {
        return res.status(404).json({
          message: "Test not found",
        });
      }

      return res.json(test);
    }
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    const tests = await Test.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Test.countDocuments(tests);
    const totalSearch = await Test.countDocuments(filter);
    const totalPages = Math.ceil(totalSearch / limit);
    return res.json({
      tests,
      totalPages,
      total,
      totalSearch,
      limit,
    });
  } catch (error) {
    console.error("Error fetching test(s):", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

//Post add new test
const addTest = async (req, res) => {
  try {
    const { title, question, duration, level } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({
        error: "Tiêu đề không hợp lệ.",
      });
    }
    if (typeof question !== "number" || question < 1) {
      return res.status(400).json({
        error: "Số câu hỏi không hợp lệ",
      });
    }
    if (typeof duration !== "number" || duration < 1) {
      return res.status(400).json({
        error: "Thời gian không hợp lệ",
      });
    }
    const validLevels = ["beginner", "intermediate", "advanced"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: "Level không hợp lệ",
      });
    }

    const newTest = new Test({
      title,
      question,
      duration,
      level,
    });

    await newTest.save();

    return res.status(201).json({
      message: "Thêm bài kiểm tra thành công",
      test: newTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi server khi thêm bài kiểm tra",
    });
  }
};

//update test
const updateTest = async (req, res) => {
  try {
    const testId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(404).json({
        error: "Invalid ID format",
      });
    }
    const existTest = await Test.findById(testId);
    if (!existTest) {
      return res.status(400).json({
        error: "Không có bài kiểm tra phù hợp",
      });
    }

    const { title, question, duration, level } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({
        error: "Tiêu đề không hợp lệ.",
      });
    }
    if (typeof question !== "number" || question < 1) {
      return res.status(400).json({
        error: "Số câu hỏi không hợp lệ",
      });
    }
    if (typeof duration !== "number" || duration < 1) {
      return res.status(400).json({
        error: "Thời gian không hợp lệ",
      });
    }
    const validLevels = ["beginner", "intermediate", "advanced"];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: "Level không hợp lệ",
      });
    }
    let updatedQuestions = existTest.questions;
    if (question < updatedQuestions.length) {
      updatedQuestions = updatedQuestions.slice(0, question);
    }

    // Cập nhật test
    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      {
        title,
        question,
        duration,
        level,
        questions: updatedQuestions,
      },
      { new: true }
    );
    return res.status(201).json({
      message: "Cập nhật kiểm tra thành công",
      question: updatedTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi server khi Cập nhật kiểm tra.",
    });
  }
};

const addQuestionToTest = async (req, res) => {
  try {
    const { questionIds } = req.body;
    const testId = req.params.id;

    if (questionIds == null || testId == null) {
      return res.status(400).json({
        error: "Thiếu id của câu hỏi hoặc test",
      });
    }
    const convertedIds = questionIds.map(
      (id) => new mongoose.Types.ObjectId(String(id))
    );

    //check số question có nhiều hơn số question có thể có ở trong test không
    const test = await Test.findById(testId);
    const maxQuestionOnTest = test.question;
    const currentQuestionOntest = test.questions.length;
    const numberSlotQuestionOnTest = maxQuestionOnTest - currentQuestionOntest;

    if (numberSlotQuestionOnTest <= 0) {
      return res.status(400).json({
        error: "Test đã đầy, không thể thêm câu hỏi.",
      });
    }
    const existingQuestionIds = test.questions.map((id) => id.toString());
    const newQuestionIds = convertedIds.filter(
      (id) => !existingQuestionIds.includes(id.toString())
    );
    const questionsToAdd = newQuestionIds.slice(0, numberSlotQuestionOnTest);

    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      {
        $push: {
          questions: {
            $each: questionsToAdd,
          },
        },
      },
      {
        new: true,
      }
    );
    if (!updatedTest) {
      return res.status(404).json({
        error: "Test không tìm thấy",
      });
    }
    res.status(201).json({
      message: "Câu hỏi đã được cập nhật thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi server khi Cập nhật kiểm tra.",
    });
  }
};

//delete test
const deleteTest = async (req, res) => {
  try {
    const testId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      return res.status(400).json({
        message: "Invalid ID format",
      });
    }
    const deleteTest = await Test.findById(testId);
    if (!deleteTest) {
      return res.status(404).json({
        error: "Không có bài kiểm tra phù hợp",
      });
    }
    await Test.findByIdAndDelete(testId);
    return res.status(200).json({
      message: "Đã xóa bài kiểm tra thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi server khi xóa bài kiểm tra",
    });
  }
};

const deleteQuestionToTest = async (req, res) => {
  try {
    const { questionId } = req.body;
    const testId = req.params.id;

    if (questionId == null || testId == null) {
      return res.status(400).json({
        error: "Thiếu id của câu hỏi hoặc test",
      });
    }

    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      {
        $pull: {
          questions: questionId,
        },
      },
      {
        new: true,
      }
    );
    if (!updatedTest) {
      return res.status(404).json({
        error: "Test không tìm thấy",
      });
    }
    res.status(201).json({
      message: "Xóa câu hỏi khỏi test thành công",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Lỗi server khi Cập nhật kiểm tra.",
    });
  }
};
module.exports = {
  getTestById,
  addTest,
  deleteTest,
  updateTest,
  addQuestionToTest,
  deleteQuestionToTest,
};
