const express = require("express");
const router = express.Router();
const { login, register, loginWithGoogle, updatePassword } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

// router.post("/login", login);
router.get("/login", login);
router.post("/register", register);
router.post("/google", loginWithGoogle);
router.put("/update-password",authMiddleware, updatePassword)
module.exports = router;
