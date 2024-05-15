import express from "express";

import verifyToken from "../middlewares/verify.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
} from "../client/controllers/user.controller.js";

const userRouter = express.Router();

userRouter.post("/register", verifyToken, registerUser);

userRouter.post("/login", verifyToken, loginUser);

userRouter.get("/logout", verifyToken, logoutUser);

export default userRouter;
