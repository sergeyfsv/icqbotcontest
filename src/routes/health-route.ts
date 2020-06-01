import express from "express";
import HealthHandler from "../controllers/health-controller";

const router = express.Router();
router.get("", HealthHandler);

export default router;
