import Submission from "../models/Submission.js";
import Problem from "../models/Problem.js";

// Create Submission (POST /problems/:slug/submit)
export const createSubmission = async (req, res) => {
  try {
    const { slug } = req.params;
    const { language, code } = req.body;
    const userId = req.user.id;

    // Basic validations
    if (!language || !code) {
      return res
        .status(400)
        .json({ message: "Language and code are required" });
    }

    // Check if problem exists
    const problem = await Problem.findOne({ slug });
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    // Create submission
    const submission = new Submission({
      userId,
      problemSlug: slug,
      language,
      code,
      status: "Pending", // will be updated after verdict system
    });

    await submission.save();

    res.status(201).json({
      message: "Submission received",
      submissionId: submission._id,
    });
  } catch (error) {
    console.error("Error creating submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get submission with problem slug and submissionId
export const getSubmissionWithSlug = async (req, res) => {
  try {
    const { slug, submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission || submission.problemSlug !== slug) {
      return res.status(404).json({
        message: "Submission not found or mismatch with problem slug",
      });
    }

    const problem = await Problem.findOne({ slug }).select("title slug");

    return res.status(200).json({
      submission,
      problem,
    });
  } catch (error) {
    console.error("Error fetching submission:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GET /submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { userId };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Submission.countDocuments(query);

    return res.status(200).json({
      submissions,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /submissions/:slug
export const getUserSubmissionsByProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { slug } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const query = {
      userId,
      problemSlug: slug,
    };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Submission.countDocuments(query);

    return res.status(200).json({
      submissions,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error("Error fetching submissions by problem:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
