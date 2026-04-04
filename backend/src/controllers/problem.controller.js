import Problem from "../models/Problem.model.js"
import { ApiError } from "../utils/ApiError.js";
import Submission from "../models/submission.model.js";



export const getAllProblems = async (req, res) => {
    try {
        const problem = await Problem.find();
        if(!problem){
             throw new ApiError(501, "fail to fetch problem from data base");
        }
        return res.status(200).json({data:problem, message: "get the problem succefully"})
    } catch (error) {
        console.log("Error accure while fething the problem", error)
    }
}

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
        res.status(201).json({data:problem, message: "problem added succefully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add problem' });
    }
}

export const getproblemById = async (req, res) => {
     try {
   const submission = await Submission.findById(req.params.id)
      .populate("problem")
      .populate("user");

   res.json({ data: submission });
   } catch (err) {
   res.status(500).json({ error: "Failed to fetch submission" });
  }
}

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Submission.aggregate([
      {
        $match: {
          "result.status": "Accepted",
        },
      },
      {
        $group: {
          _id: "$user",
          solved: { $sum: 1 },
        },
      },
      {
        $sort: { solved: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // populate user details
    const populated = await Submission.populate(leaderboard, {
      path: "_id",
      select: "name email",
    });

    res.json({ data: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const submissions = await Submission.find({ user: userId });

    const total = submissions.length;

    const accepted = submissions.filter(
      (s) => s.result?.status === "Accepted"
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
    const contest = await Contest.findById(req.params.id).populate("problems");
    res.json({ data: contest });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contest" });
  }
};