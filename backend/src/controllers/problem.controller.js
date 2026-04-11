import Problem from "../models/Problem.model.js";
import { ApiError } from "../utils/ApiError.js";
import Submission from "../models/Submission.model.js";
import Contest from "../models/Contest.model.js";

export const getAllProblems = async (req, res) => {
  try {
    const problem = await Problem.find();
    if (!problem) {
      throw new ApiError(501, "fail to fetch problem from data base");
    }
    return res
      .status(200)
      .json({ data: problem, message: "get the problem succefully" });
  } catch (error) {
    console.log("Error accure while fething the problem", error);
  }
};

export const addProblem = async (req, res) => {
  const { title, description, difficulty, testCases } = req.body;

  const problem = new Problem({
    title,
    description,
    difficulty,
    testCases,
  });

  try {
    await problem.save();
    res
      .status(201)
      .json({ data: problem, message: "problem added succefully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add problem" });
  }
};

export const getproblemById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate("problem")
      .populate("user");

    res.json({ data: submission });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch submission" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const submissions = await Submission.find({ user: userId });

    const total = submissions.length;

    const accepted = submissions.filter(
      (s) => s.result?.status === "Accepted",
    ).length;

    const wrong = total - accepted;

    const successRate = total > 0 ? ((accepted / total) * 100).toFixed(2) : 0;

    res.json({
      total,
      accepted,
      wrong,
      successRate,
      recent: submissions.slice(-5).reverse(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

export const getContest = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Contest ID:", id);

    const contest = await Contest.findById(id).populate("problems");

    console.log("Contest Data:", contest); 

    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    res.json({ data: contest });
  } catch (err) {
    console.error("REAL ERROR:", err); 
    res.status(500).json({ error: err.message }); 
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      {
        $group: {
          _id: "$user",
          totalScore: { $sum: "$score" },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
    ]);

    res.json({ data: leaderboard });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};
