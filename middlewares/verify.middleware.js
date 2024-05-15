import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";
import apiError from "../utils/apiError.js";

/**
 * Middleware function to verify the authenticity of a token.
 */
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new apiError(401, "Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded?._id).select("-password");

    if (!user) {
      throw new apiError(401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.send(new apiError(500, error.message));
  }
};

export default verifyToken;
