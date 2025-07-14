import express from "express";

import featuresrouter from "./features/routes.js";

const router = express.Router();

router.use("/api", featuresrouter);

export default router;
