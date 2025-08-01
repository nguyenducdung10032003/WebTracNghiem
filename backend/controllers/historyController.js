const TestHistory = require("../models/TestHistory");
const mongoose = require("mongoose");
const { countDocuments } = require("../models/User");

const addTestHistory = async (req, res) => {
  const newHistory = req.body;
  const testhistory = new TestHistory(newHistory);
  await testhistory.save();
  res.status(201).json({ message: "Lịch sử bài đã được lưu" });
};

const getTestHistory = async (req, res) => {
  try {
    const {
      sortField = "completedAt",
      sortOrder = "desc",
      userId,
      role,
    } = req.query;

    let filter = {};
    if (role !== "admin") {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid or missing userId" });
      }
      filter.userId = new mongoose.Types.ObjectId(userId);
    }

    const allowedFields = [
      "score",
      "correctAnswers",
      "timeSpent",
      "completedAt",
    ];
    if (!allowedFields.includes(sortField)) {
      return res.status(400).json({ error: "Invalid sort field" });
    }

    // Lấy lịch sử test
    const histories = await TestHistory.find(filter)
      .sort({ [sortField]: sortOrder === "asc" ? 1 : -1 })
      .populate("userId", "name email")
      .populate("testId", "title level");

    // Tính toán averageScore (chỉ khi có userId)
    let averageScore = 0;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const result = await TestHistory.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: "$userId",
            averageScore: { $avg: "$score" },
          },
        },
      ]);
      averageScore = result[0]?.averageScore?.toFixed(2) || 0;
    }

    // Tính toán mostFrequentLevel
    const levelCounts = {};
    let mostFrequentLevel = null;
    let maxCount = 0;

    for (const history of histories) {
      if (history.testId?.level) {
        const level = history.testId.level;
        levelCounts[level] = (levelCounts[level] || 0) + 1;

        if (levelCounts[level] > maxCount) {
          mostFrequentLevel = level;
          maxCount = levelCounts[level];
        }
      }
    }

    // Lấy bài test gần nhất
    let tilteLastes = null;
    const lasttest = await TestHistory.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("testId", "title level")
      .limit(1);

    if (lasttest.length > 0 && lasttest[0].testId) {
      tilteLastes = lasttest[0].testId.title;
    }

    const countHistories = await TestHistory.countDocuments(filter);

    res.json({
      histories,
      countHistories,
      averageScore,
      mostFrequentLevel,
      tilteLastes,
    });
  } catch (error) {
    console.error("Error fetching test history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addTestHistory,
  getTestHistory,
};
