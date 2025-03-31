import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
    createSubmission,
    getSubmissionWithSlug,
    getUserSubmissions,
    getUserSubmissionsByProblem,
  } from "../controller/submissionController.js";
  

const router = express.Router();

// POST /submissions - for code submission
router.post("/problems/:slug/submit", verifyToken, createSubmission);
// Get specific submission by slug + ID
router.get("/problems/:slug/submissions/:submissionId", getSubmissionWithSlug);
// Get all submissions of logged-in user (optional filters)
router.get("/", verifyToken, getUserSubmissions);
// Get all submissions of logged-in user for a specific problem
router.get("/:slug", verifyToken, getUserSubmissionsByProblem);

export default router;
