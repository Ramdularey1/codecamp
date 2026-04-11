import mongoose, { Schema } from "mongoose";

const submissionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    problem: {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      require: true,
    },
    source_code: {
      type: String,
      required: true,
    },
    language_id: {
      type: Number,
      required: true,
    },
    result: {
      status: { type: String },
      stdout: { type: String },
      stderr: { type: String },
      compile_output: { type: String },
    },
    score: {
      type: Number,
      default: 0,
    },
    contest: {
      type: Schema.Types.ObjectId,
      ref: "Contest",
    },
  },
  { timestamps: true },
);

const Submission =
  mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
export default Submission;
