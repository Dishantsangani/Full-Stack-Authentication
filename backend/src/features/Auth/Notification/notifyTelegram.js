import axios from "axios";

const BOT_TOKEN = "8040573657:AAFS39pNVriNiBrYfXKCzy1qoWV6cB1yrf4"; // your bot token
const CHAT_ID = "7891922761"; // your Telegram user ID

async function notifyTelegram(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
    });
    console.log("📨 Notification sent to Telegram.");
  } catch (error) {
    console.error("❌ Failed to send Telegram message:", error.message);
  }
}

export { notifyTelegram };
