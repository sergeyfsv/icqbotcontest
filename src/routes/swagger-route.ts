import express from "express";
import swaggerUI from "swagger-ui-express";

import { SwaggerSettings } from "./../config/swagger";

const router = express.Router();

router.use("/api-docs", swaggerUI.serve);
router.get("/api-docs", swaggerUI.setup(SwaggerSettings));

export default router;
