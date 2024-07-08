import Submission from "../models/submission.model.js";
import axios from "axios";
import { ApiError } from "../utils/ApiError.js";





export const submitCode = async (req, res) => {
    const { userId, problemId, source_code, language_id, stdin } = req.body;

    try {
        const response = await axios.post('https://judge0-extra-ce.p.rapidapi.com/submissions', {
            source_code,
            language_id,
            stdin
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

        // Extract status from response.data
        const status = response.data.status;

        const submission = new Submission({
            user: userId,
            problem: problemId,
            source_code,
            language_id,
            result: {
                status: status.toString(), // Ensure status is stored as string
                // Other result fields as needed
            }
        });

        await submission.save();
        res.json({ data: response.data });

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


