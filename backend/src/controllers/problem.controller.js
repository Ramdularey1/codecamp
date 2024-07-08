import Problem from "../models/Problem.model.js"
import { ApiError } from "../utils/ApiError.js";



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