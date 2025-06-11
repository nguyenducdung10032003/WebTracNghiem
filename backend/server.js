const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();

const server = express();
connectDB();

server.use(cors());
server.use(express.json());

server.get(`/api/users`, async (req, res) => {
    console.log("11");
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

// === Server khởi động ===
const PORT = process.env.PORT || 9999;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
