const INSERT_USER = `INSERT INTO protectrout (email,password) VALUES ($1,$2)`;
const CHECK_USER = `SELECT * FROM protectrout WHERE email = $1`;
// Forgot_Password
const INSERT_TOKEN_EMAIL = `INSERT INTO password_reset_tokens (email, token, expires_at) VALUES ($1, $2, $3)`;
const FIND_TOKEN = `SELECT email, expires_at FROM password_reset_tokens WHERE token = $1`;
const UPDATE_MAIN_TABLE_PASSSWORD = `UPDATE protectrout SET password = $1 WHERE email = $2`;
const DELETE_TOKEN = `DELETE FROM password_reset_tokens WHERE token = $1`;

//Telegram Time
const TIMESTAMP = new Date().toLocaleString("en-IN", {
  timeZone: "Asia/Kolkata",
});

export {
  INSERT_USER,
  CHECK_USER,
  INSERT_TOKEN_EMAIL,
  FIND_TOKEN,
  UPDATE_MAIN_TABLE_PASSSWORD,
  DELETE_TOKEN,
  TIMESTAMP,
};
