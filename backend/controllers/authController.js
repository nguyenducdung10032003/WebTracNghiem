const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, expiresIn } = require("../config/jwt");
const admin = require("../firebaseAdmin");

const login = async (req, res) => {
  try {
    // const { email, password } = req.body;
    const { email, password } = req.query;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(404).json({
        message: "User not found!!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    // console.log("User from DB:", user);
    // console.log("Password from request:", password);
    // console.log("Password from DB:", user.password);
    // console.log("Password match:", isMatch);

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      {
        expiresIn,
      }
    );
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: "Thiếu thông tin đăng ký",
      });
    }
    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(409).json({
        message: "User Đã tồn tại!!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const loginWithGoogle = async (req, res) => {
  const { token } = req.body;
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decoded;

    let user = await User.findOne({ $or: [{ firebaseUid: uid }, { email }] });
    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email,
        name: name || "No name",
        role: "user",
        password: "User@123",
      });
    }

    const jwtToken = jwt.sign({ id: user._id }, secret, { expiresIn });

    return res.json({
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        password: user.password,
      },
    });
  } catch (err) {
    console.error("Firebase error:", err);
    return res
      .status(401)
      .json({ error: "Unauthorized", message: err.message });
  }
};

module.exports = {
  login,
  register,
  loginWithGoogle,
  updatePassword
};
