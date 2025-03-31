// models/Problem.js
import mongoose from "mongoose";
import slugify from "slugify";

const ProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    constraints: { type: String, required: true },
    tags: { type: [String], default: [] },

    sampleTestcases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
    hiddenTestcases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

ProblemSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
