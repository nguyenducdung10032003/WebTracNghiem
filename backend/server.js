const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/questionRoutes");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const bcrypt = require("bcryptjs");
const crypto = require("crypto"); 
const nodemailer = require("nodemailer"); 
dotenv.config();
connectDB();

const server = express();
server.use(cors());
server.use(express.json());

server.use("/api/tests", testRoutes);
server.use("/api/questions", questionRoutes);
server.use("/api/auth", authRoutes);
server.use("/api/history", historyRoutes);

server.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy email." });

    // Tạo token reset
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 1000 * 60 * 30; // 30 phút

    user.resetToken = token;
    user.tokenExpiry = expiry;
    await user.save();

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "dungndhe171774@fpt.edu.vn",
        pass: "hfmyptuvoxuhnfta",
      },
    });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await transporter.sendMail({
      to: email,
      subject: "Đặt lại mật khẩu",
      html: `<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
             <p>Click vào link dưới để đặt lại mật khẩu:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: "Email đặt lại mật khẩu đã được gửi." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

server.post("/api/auth/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      tokenExpiry: { $gt: Date.now() }, // token còn hạn
    });

    if (!user) return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn." });

    // Cập nhật mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Xóa token sau khi sử dụng
    user.resetToken = undefined;
    user.tokenExpiry = undefined;

    await user.save();

    res.json({ message: "Mật khẩu đã được đặt lại thành công." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// === Server khởi động ===
const PORT = process.env.PORT || 9999;
server.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
