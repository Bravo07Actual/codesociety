import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import verifyAdmin from "../middleware/verifyAdmin.js";
import { 
  createProblem, 
  getAllProblems, 
  getProblemBySlug, 
  updateProblem, 
  deleteProblem 
} from "../controller/problemController.js";

const router = express.Router();

// Admin-protected routes
router.post("/", verifyToken, verifyAdmin, createProblem);
router.put("/:slug", verifyToken, verifyAdmin, updateProblem);
router.delete("/:slug", verifyToken, verifyAdmin, deleteProblem);

// Public routes
router.get("/", getAllProblems);
router.get("/:slug", getProblemBySlug); // changed from :id to :slug

export default router;
