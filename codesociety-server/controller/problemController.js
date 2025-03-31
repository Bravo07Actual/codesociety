import Problem from "../models/Problem.js";

// Create Problem
export const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      constraints,
      tags,
      sampleTestcases,
      hiddenTestcases,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !difficulty ||
      !constraints ||
      !sampleTestcases ||
      !hiddenTestcases
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate difficulty enum strictly
    const allowedDifficulties = ["Easy", "Medium", "Hard"];
    if (!allowedDifficulties.includes(difficulty)) {
      return res.status(400).json({ message: "Invalid difficulty level" });
    }

    // Validate tags is array & non-empty
    if (!Array.isArray(tags) || tags.length === 0) {
      return res
        .status(400)
        .json({ message: "Tags must be a non-empty array" });
    }

    // Validate sampleTestcases
    if (
      !Array.isArray(sampleTestcases) ||
      sampleTestcases.length === 0 ||
      !sampleTestcases.every((tc) => tc.input && tc.output)
    ) {
      return res.status(400).json({
        message: "Each sample testcase must have input and output",
      });
    }

    // Validate hiddenTestcases
    if (
      !Array.isArray(hiddenTestcases) ||
      hiddenTestcases.length === 0 ||
      !hiddenTestcases.every((tc) => tc.input && tc.output)
    ) {
      return res.status(400).json({
        message: "Each hidden testcase must have input and output",
      });
    }

    // Check for existing title
    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res
        .status(400)
        .json({ message: "Problem with this title already exists" });
    }

    const problem = new Problem({
      title,
      description,
      difficulty,
      constraints,
      tags,
      sampleTestcases,
      hiddenTestcases,
    });

    await problem.save();
    return res
      .status(201)
      .json({ message: "Problem created successfully", problem });
  } catch (err) {
    console.log("Error in create problem:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Problems with Filters & Pagination
export const getAllProblems = async (req, res) => {
  try {
    const { search, difficulty, tags, page = 1, limit = 10 } = req.query;

    const query = {};

    // Title search
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Difficulty filter
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Tags filter - now works with ANY tag match
    if (tags) {
      const tagsArray = tags.split(",").map((tag) => tag.trim());
      query.tags = { $in: tagsArray };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const problems = await Problem.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Problem.countDocuments(query);

    return res.status(200).json({
      problems,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Problem by Slug (instead of ID)
export const getProblemBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    return res.status(200).json({ problem });
  } catch (error) {
    console.error("Error fetching problem:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update Problem by Slug
export const updateProblem = async (req, res) => {
  try {
    const { slug } = req.params;
    const updates = req.body;

    // Block empty updates early
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ message: "At least one field is required to update" });
    }

    // Validate difficulty if provided
    if (updates.difficulty) {
      const allowedDifficulties = ["Easy", "Medium", "Hard"];
      if (!allowedDifficulties.includes(updates.difficulty)) {
        return res.status(400).json({ message: "Invalid difficulty level" });
      }
    }

    // Validate tags if provided
    if (
      updates.tags &&
      (!Array.isArray(updates.tags) || updates.tags.length === 0)
    ) {
      return res
        .status(400)
        .json({ message: "Tags must be a non-empty array" });
    }

    // Validate testcases if provided
    if (
      updates.testcases &&
      (!Array.isArray(updates.testcases) || updates.testcases.length === 0)
    ) {
      return res
        .status(400)
        .json({ message: "Testcases must be a non-empty array" });
    }

    const updatedProblem = await Problem.findOneAndUpdate({ slug }, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res
      .status(200)
      .json({ message: "Problem updated successfully", updatedProblem });
  } catch (error) {
    console.error("Error updating problem:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Problem by Slug
export const deleteProblem = async (req, res) => {
  try {
    const { slug } = req.params;

    const deletedProblem = await Problem.findOneAndDelete({ slug });

    if (!deletedProblem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json({ message: "Problem deleted successfully" });
  } catch (error) {
    console.error("Error deleting problem:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
