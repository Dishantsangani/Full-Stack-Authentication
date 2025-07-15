import express from "express";
import authrouter from "./Auth/routes.js";

const featuresrouter = express.Router();

featuresrouter.use("/features", authrouter);

export default featuresrouter;
