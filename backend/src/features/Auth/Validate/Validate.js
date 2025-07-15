import bcrypt from "bcrypt";

export function validateEmailAndPassword({ email, password }, res) {
  if (!email || !password) {
    res.status(409).json({ message: "All Fields Required" });
    return false;
  }
  return true;
}

export async function validatePassword({ password, dbPassword }, res) {
  const isValid = await bcrypt.compare(password, dbPassword);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  return true;
}

export async function validateemail(email, res) {
  if (!email) {
    return res.status(409).json({ message: "All Filed Required" });
  }
}

export async function ValidTokenPassword(token, password, res) {
  if (!token || !password || password.length < 6) {
    res.status(400).json({
      message:
        "Token and password are required, and password must be at least 6 characters long.",
    });
    return false;
  }
  return true;
}
