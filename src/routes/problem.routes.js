import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getAllSolveProblemsByUser,
  getProblemById,
  updateProblem,
} from "../controller/problem.controller.js";
const problemRouter = express.Router();
problemRouter.post(
  "/create-problem",
  authMiddleware,
  checkAdmin,
  createProblem,
);
problemRouter.get(
  "/get-all-problems",
  authMiddleware,
  checkAdmin,
  getAllProblems,
);
problemRouter.get(
  "/get-problem/:id",
  authMiddleware,
  checkAdmin,
  getProblemById,
);
problemRouter.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblem,
);
problemRouter.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblem,
);
problemRouter.get(
  "/get-solve-problems",
  authMiddleware,
  getAllSolveProblemsByUser,
);
export default problemRouter;
