import Submission from "../models/submission.model.js";
import Problem from "../models/Problem.model.js";
import axios from "axios";
import { ApiError } from "../utils/ApiError.js";

export const submitCode = async (req, res) => {
    const { userId, problemId, source_code, language_id } = req.body;

    try {
        // Find the problem to get the test cases
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Iterate over each test case and send the code to Judge0
        const testCaseResults = [];
        for (let testCase of problem.testCases) {
            const response = await axios.post('https://judge0-extra-ce.p.rapidapi.com/submissions', {
                source_code,
                language_id,
                stdin: testCase.input
            }, {
                headers: {
                    'x-rapidapi-key': 'e1bf0af75amshab68da3c814f646p1daf8ejsn1b95b7e99d3c', 
                    'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                },
                params: {
                    base64_encoded: 'false',
                    wait: 'true',
                },
            });

            if (response.status !== 200) {
                throw new Error(`Submission failed with status ${response.status}`);
            }

            const { stdout, stderr, compile_output } = response.data;
            

            // Compare outputs against expected results
            const expectedOutput = testCase.output.trim();
            const actualOutput = stdout ? stdout.trim() : (stderr || compile_output || "").trim();
            const passed = actualOutput === expectedOutput;

            testCaseResults.push({
                input: testCase.input,
                expectedOutput,
                actualOutput,
                passed
            });
        }

        // Save submission details
        const submission = new Submission({
            user: userId,
            problem: problemId,
            source_code,
            language_id,
            result: {
                status: 'completed',
                testCaseResults, // Store the detailed test case results
            }
        });

        await submission.save();
        res.json({ data: testCaseResults });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong while sending code to judge!' });
    }
};

export const getSubmissionsByUser = async(req, res) => {
    const {userId} = req.params;

    try {
        if(!userId){
             throw new ApiError(400, "userId does not exist");
        }

        const submissions = await Submission.find({user: userId}).populate('user').populate('problem')

        if (!submissions || submissions.length === 0) {
            throw new ApiError(404, "No submissions found for this user")
          }

          return res.status(200).json({data:submissions })
    } catch (error) {
        console.error('Error fetching submissions:', error);
    }
}


