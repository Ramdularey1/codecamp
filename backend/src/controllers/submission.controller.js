import User from "../models/User.model.js";
import Submission from "../models/Submission.model.js";
import Problem from "../models/Problem.model.js";
import Contest from "../models/Contest.model.js";
import mongoose from "mongoose";
import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

// export const submitCode = async (req, res) => {
//   const { userId, problemId, source_code, language_id } = req.body;

//   try {
//     // Find the problem to get the test cases
//     const problem = await Problem.findById(problemId);
//     if (!problem) {
//       return res.status(404).json({ error: "Problem not found" });
//     }

//     // Iterate over each test case and send the code to Judge0
//     const testCaseResults = [];
//     for (let testCase of problem.testCases) {
//       const response = await axios.post(
//         "https://judge0-extra-ce.p.rapidapi.com/submissions",
//         {
//           source_code,
//           language_id,
//           stdin: testCase.input,
//         },
//         {
//           headers: {
//             "x-rapidapi-key":
//               "e1bf0af75amshab68da3c814f646p1daf8ejsn1b95b7e99d3c",
//             "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
//             "Content-Type": "application/json",
//           },
//           params: {
//             base64_encoded: "false",
//             wait: "true",
//           },
//         },
//       );

//       if (response.status !== 200) {
//         throw new Error(`Submission failed with status ${response.status}`);
//       }

//       const { stdout, stderr, compile_output } = response.data;

//       // Compare outputs against expected results
//       const expectedOutput = testCase.output.trim();
//       const actualOutput = stdout
//         ? stdout.trim()
//         : (stderr || compile_output || "").trim();
//       const passed = actualOutput === expectedOutput;

//       testCaseResults.push({
//         input: testCase.input,
//         expectedOutput,
//         actualOutput,
//         passed,
//       });
//     }

//     // Save submission details
//     const submission = new Submission({
//       user: userId,
//       problem: problemId,
//       source_code,
//       language_id,
//       result: {
//         status: "completed",
//         testCaseResults, // Store the detailed test case results
//       },
//     });

//     await submission.save();
//     res.json({ data: testCaseResults });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "Something went wrong while sending code to judge!" });
//   }
// };


// export const submitCode = async (req, res) => {
//   const { userId, problemId, source_code, language_id } = req.body;

//   try {
//     // 🔥 Get problem
//     const problem = await Problem.findById(problemId);
//     if (!problem) {
//       return res.status(404).json({ error: "Problem not found" });
//     }

//     const testCaseResults = [];

//     // 🔥 Run all test cases
//     for (let testCase of problem.testCases) {
//       const response = await axios.post(
//         "https://judge0-extra-ce.p.rapidapi.com/submissions",
//         {
//           source_code,
//           language_id,
//           stdin: testCase.input,
//         },
//         {
//           headers: {
//             "x-rapidapi-key":
//               "e1bf0af75amshab68da3c814f646p1daf8ejsn1b95b7e99d3c",
//             "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
//             "Content-Type": "application/json",
//           },
//           params: {
//             base64_encoded: "false",
//             wait: "true",
//           },
//         }
//       );

//       if (response.status !== 200) {
//         throw new Error(`Submission failed with status ${response.status}`);
//       }

//       const { stdout, stderr, compile_output } = response.data;

//       // 🔥 Normalize output (IMPORTANT FIX)
//       const expectedOutput = testCase.output.trim();
//       const actualOutput = stdout
//         ? stdout.trim()
//         : (stderr || compile_output || "").trim();

//       const passed = actualOutput === expectedOutput;

//       testCaseResults.push({
//         input: testCase.input,
//         expectedOutput,
//         actualOutput,
//         passed,
//       });
//     }

//     // 🔥 CALCULATE RESULT
//     const totalPassed = testCaseResults.filter((t) => t.passed).length;
//     const total = testCaseResults.length;

//     const status =
//       totalPassed === total ? "Accepted" : "Wrong Answer";

//     const score = status === "Accepted" ? 100 : 0;

//     // 🔥 SAVE SUBMISSION
//     const submission = new Submission({
//       user: userId,
//       problem: problemId,
//       source_code,
//       language_id,
//       result: {
//         status,
//         testCaseResults,
//       },
//       score, // ✅ NEW FIELD (important for leaderboard)
//     });

//     await submission.save();

//     // 🔥 RESPONSE
//     res.json({
//       data: testCaseResults,
//       status,
//       score,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       error: "Something went wrong while sending code to judge!",
//     });
//   }
// };

export const submitCode = async (req, res) => {
  const { userId, problemId, source_code, language_id, contestId } = req.body;

  try {
    // 🔥 Get problem
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    const testCaseResults = [];

    // 🔥 Run all test cases
    for (let testCase of problem.testCases) {
      const response = await axios.post(
        "https://judge0-extra-ce.p.rapidapi.com/submissions",
        {
          source_code,
          language_id,
          stdin: testCase.input,
        },
        {
          headers: {
            "x-rapidapi-key":
              "e1bf0af75amshab68da3c814f646p1daf8ejsn1b95b7e99d3c",
            "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
            "Content-Type": "application/json",
          },
          params: {
            base64_encoded: "false",
            wait: "true",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Submission failed with status ${response.status}`);
      }

      const { stdout, stderr, compile_output } = response.data;

      // 🔥 Normalize output
      const expectedOutput = testCase.output.trim();
      const actualOutput = stdout
        ? stdout.trim()
        : (stderr || compile_output || "").trim();

      const passed = actualOutput === expectedOutput;

      testCaseResults.push({
        input: testCase.input,
        expectedOutput,
        actualOutput,
        passed,
      });
    }

    // 🔥 CALCULATE RESULT
    const totalPassed = testCaseResults.filter((t) => t.passed).length;
    const total = testCaseResults.length;

    const status =
      totalPassed === total ? "Accepted" : "Wrong Answer";

    const score = status === "Accepted" ? 100 : 0;

    // 🔥 SAVE SUBMISSION (UPDATED)
    const submission = new Submission({
      user: userId,
      problem: problemId,
      contest: contestId || null, // ✅ important (handles normal + contest)
      source_code,
      language_id,
      result: {
        status,
        testCaseResults,
      },
      score,
    });

    await submission.save();

    // 🔥 RESPONSE
    // res.json({
    //   data: testCaseResults,
    //   status,
    //   score,
    // });

    // 🔥 REAL-TIME EVENT
if (contestId) {
  global.io.emit("leaderboardUpdated", {
    contestId,
  });
}

// RESPONSE
res.json({
  data: testCaseResults,
  status,
  score,
});

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Something went wrong while sending code to judge!",
    });
  }
};

export const getSubmissionsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!userId) {
      throw new ApiError(400, "userId does not exist");
    }

    const submissions = await Submission.find({ user: userId })
      .populate("user")
      .populate("problem");

    if (!submissions || submissions.length === 0) {
      throw new ApiError(404, "No submissions found for this user");
    }

    return res.status(200).json({ data: submissions });
  } catch (error) {
    console.error("Error fetching submissions:", error);
  }
};
export const createContest = async (req, res) => {
  try {
    const { title, problems, startTime, endTime } = req.body;

    const contest = new Contest({
      title,
      problems, // array of problem IDs
      startTime,
      endTime,
    });

    await contest.save();

    res.status(201).json({ data: contest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create contest" });
  }
};

export const getContestLeaderboard = async (req, res) => {
  try {
    const { id } = req.params; // contestId

    const leaderboard = await Submission.aggregate([
      {
        $match: {
          contest: new mongoose.Types.ObjectId(id),
        },
      },
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
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};




