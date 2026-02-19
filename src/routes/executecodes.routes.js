import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { excuteCode } from "../controller/executecode.controller.js";
const executionRoute = express.Router();
executionRoute.post("/",authMiddleware,excuteCode)
export default executionRoute;