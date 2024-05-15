import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

/**
 * Generates a JSON Web Token (JWT) for the user.
 */
userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRY,
    }
  );
};

/**
 * Checks if the provided password is correct.
 */
userSchema.methods.isPassCorrect = async function (data) {
  return await bcrypt.compare(data, this.password);
};

export default mongoose.model("User", userSchema);
