const express = require("express");
const router = express.Router();
const { addTestHistory, getTestHistory } = require("../controllers/historyController");

router.post("/add", addTestHistory);
router.get("/", getTestHistory)
module.exports = router;
