import mongoose, { Schema } from "mongoose";

const contestSchema = new Schema({
  title: String,
  problems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Problem",
    },
  ],
  startTime: Date,
  endTime: Date,
});

const Contest =
  mongoose.models.Contest || mongoose.model("Contest", contestSchema);

export default Contest;