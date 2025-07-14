import express from "express";
import authrouter from "./Auth/routes.js";

const featuresrouter = express.Router();

featuresrouter.use("/main", authrouter);

export default featuresrouter;
