import express from "express";
import {
  Signin,
  Signup,
  ForgotPassword,
  ResetPassword,
} from "./Controller/Authcontroller.js";
const authrouter = express.Router();
import { VerifyToken } from "./Middleware/middleware.js";

authrouter.post("/signin", Signin);
authrouter.post("/signup", Signup);
authrouter.post("/forgot-password", ForgotPassword);
authrouter.post("/reset-password", ResetPassword);
authrouter.get("/home", VerifyToken, (req, res) => {
  res.json({ message: `Hello ${req.user.email}, you're authorized.` });
});
authrouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // ✅ true in production (HTTPS)
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export default authrouter;
