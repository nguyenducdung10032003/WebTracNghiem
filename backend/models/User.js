const mongoose = require("mongoose");

const passwordRegex = /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return passwordRegex.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid password. Password must be at least 8 characters long and include lowercase letters, numbers, and special characters.`,
      },
    },
    role: { type: Number, enum: [0, 1], required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model('User', userSchema);