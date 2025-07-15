import pool from "../../../Database/DbConnection.js";
import {
  validateEmailAndPassword,
  validatePassword,
  validateemail,
  ValidTokenPassword,
} from "../Validate/Validate.js";

import {
  findUserByEmail,
  generateToken,
  setTokenCookie,
  hashpassword,
  gentoken,
  sendforgotmail,
  ValidToken,
  ResetNewPassword,
} from "../Services/services.js";

import { nanoid } from "nanoid";

async function Signin(req, res) {
  try {
    const { email, password } = req.body;
    if (!validateEmailAndPassword({ email, password }, res)) return;

    const user = await findUserByEmail(email, res);
    if (!user) return;

    const isValid = await validatePassword({
      password,
      dbPassword: user.password,
    });
    if (isValid !== true) return;

    const token = generateToken({ email });
    setTokenCookie(res, token);

    return res.status(201).json({ message: "User Login Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function Signup(req, res) {
  try {
    const { email, password } = req.body;
    if (!validateEmailAndPassword({ email, password }, res)) return;

    await hashpassword(password, email);

    const token = generateToken({ email });
    setTokenCookie(res, token);

    return res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
}

async function ForgotPassword(req, res) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { email } = req.body;
    if (!validateemail({ email }, res)) return;
    
    const user = await findUserByEmail(email, res);
    if (!user) return;

    const token = nanoid();
    await gentoken(email, client, token);

    await sendforgotmail(token, email);

    await client.query("COMMIT");
    return res.status(200).json({ message: "Reset token sent to email" });
  } catch (error) {
    await client.query("ROLLBACK");
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  } finally {
    client.release();
  }
}

async function ResetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const isValid = await (ValidTokenPassword(token, password), res);
    if (!isValid) return;

    const tokenRow = await ValidToken(token);

    if (!tokenRow) {
      return res.status(400).json({ message: "Token is invalid or expired" });
    }
    const email = tokenRow.email;
    await ResetNewPassword(email, password, token);

    const authToken = generateToken({ email });
    setTokenCookie(res, authToken);

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
