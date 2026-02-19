import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmissions, getSubmissionForProblem, getSubmissionsCountByProblem } from "../controller/submission.controller.js";
const submissionRoute = express.Router();
submissionRoute.get("/get-all-submissions",authMiddleware,getAllSubmissions)
submissionRoute.get("/get-submission/:id",authMiddleware,getSubmissionForProblem)
submissionRoute.get("/get-submissions-count/:problemId",authMiddleware,getSubmissionsCountByProblem)

export default submissionRoute;