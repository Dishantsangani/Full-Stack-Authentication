import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import router from "./routes.js";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT;
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/", router);

app.listen(port, () => console.log(`Server Started at Port ${port}`));
