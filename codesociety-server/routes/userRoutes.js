import express from "express";
const router = express.Router();

// Profile route (protected)
router.get("/profile", (req, res) => {
  // Logic to fetch user profile
  res.send("Profile route hit");
});

export default router;
