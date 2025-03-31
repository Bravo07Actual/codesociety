import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    problemSlug: { type: String, required: true }, // slug instead of problem ID
    language: { type: String, required: true }, // e.g., "cpp", "python", "java"
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Wrong Answer", "Runtime Error", "Compilation Error", "Time Limit Exceeded"],
      default: "Pending",
    },
    verdict: { type: String }, // optional message / output
    executionTime: { type: Number }, // in ms
    memory: { type: Number }, // in KB
  },
  { timestamps: true }
);

const Submission = mongoose.model("Submission", SubmissionSchema);
export default Submission;
