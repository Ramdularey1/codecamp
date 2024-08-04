import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentProblem } from "../utils/currentProblem";
import { Editor } from "@monaco-editor/react";
import axios from "axios";

const CodeSections = () => {
    const dispatch = useDispatch();
    const { id } = useParams();

    const problems = useSelector((state) => state.allproblems.allProblems);
    const currentProblem = useSelector((state) => state.currentProblem.currentProblem);

    const [sourceCode, setSourceCode] = useState("");
    const [languageId, setLanguageId] = useState(4); // Default language ID for Java
    const [stdin, setStdin] = useState(""); // For any input the code needs
    const [submissionResult, setSubmissionResult] = useState(null);

    const boilerplateCode = {
        4: `// Java boilerplate
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        2: `// C++ boilerplate
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
        28: `# Python boilerplate
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
    };

    useEffect(() => {
        const selectedProblem = problems.find((item) => item._id === id);
        if (selectedProblem) {
            dispatch(updateCurrentProblem(selectedProblem));
        }
    }, [dispatch, id, problems]);

    useEffect(() => {
        // Set the boilerplate code for the selected language
        setSourceCode(boilerplateCode[languageId]);
    }, [languageId]);

    const handleSubmit = async () => {
        try {
            const testCaseInputs = currentProblem.testCases.map(testCase => testCase.input);
            const response = await axios.post('http://localhost:8000/api/v1/users/submit-code', {
                problemId: id,
                source_code: sourceCode,
                language_id: languageId,
                stdin: testCaseInputs,
            });

            console.log("Submission response:", response.data);
            setSubmissionResult(response.data.data);
        } catch (error) {
            console.error("Error submitting code:", error);
        }
    };

    const handleClearResult = () => {
        setSubmissionResult(null);
    };

    return (
        <>
            <Navbar />
            <div className="flex flex-col md:flex-row ">
                {/* Left section */}
                <div className="md:w-1/2 w-full bg-gray-900 text-white overflow-auto">
                    <div className="p-6 border-b border-gray-700">
                        <h1 className="text-2xl font-bold">{currentProblem?.title || "Loading..."}</h1>
                        <p className="text-sm mt-2 text-gray-400 font-medium">
                            Difficulty: <span className="font-extrabold">{currentProblem?.difficulty || "Loading..."}</span>
                        </p>
                    </div>
                    <div className="p-6 text-gray-300">
                        <div>
                            <h3>{currentProblem?.description || "Loading description..."}</h3>
                        </div>
                        <div className="mt-6">
                            <h1 className="font-bold text-lg">Example:</h1>
                            {currentProblem?.testCases?.length > 0 ? (
                                currentProblem.testCases.map((item, index) => (
                                    <div key={index} className="mt-4 bg-gray-800 text-gray-300 rounded-md p-3 flex flex-col gap-2 border border-gray-700">
                                        <h1 className="font-semibold">Input: <span className="font-normal">{item.input}</span></h1>
                                        <h1 className="font-semibold">Output: <span className="font-normal">{item.output}</span></h1>
                                        <h1 className="font-semibold">Explanation: <span className="font-normal">{item.explanation}</span></h1>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">No test cases available</p>
                            )}
                            <div className="mt-6">
                                <h1 className="font-bold text-lg">Expected Time Complexity: <span className="font-normal">O(n)</span></h1>
                                <h1 className="font-bold text-lg">Expected Auxiliary Space: <span className="font-normal">O(1)</span></h1>
                                <h1 className="mt-4 font-bold text-lg">Constraints:</h1>
                                <div>
                                    {/* Add constraints content here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right section */}
                <div className="md:w-1/2 w-full flex flex-col">
                    <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                        <select
                            className="bg-gray-800 text-white rounded-sm outline-none p-2"
                            value={languageId}
                            onChange={(e) => setLanguageId(parseInt(e.target.value))}
                        >
                            <option value="4">Java</option>
                            <option value="2">C++</option>
                            <option value="28">Python</option>
                        </select>
                    </div>
                    <div className="flex-1 pt-4">
                        <div className="h-full">
                            <Editor
                                height="calc(100vh - 130px)" // Adjust height based on padding and select height
                                language={languageId === 4 ? "java" : languageId === 2 ? "cpp" : "python"}
                                theme="vs-dark"
                                value={sourceCode}
                                onChange={(value) => setSourceCode(value)}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 16,
                                }}
                            />
                        </div>
                        <div className="flex justify-center md:absolute bottom-2 md:right-4  mt-4">
                            <button
                                className="text-green-600 border-2 border-green-800 hover:bg-green-700 hover:text-white rounded p-2"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {submissionResult && (
                <div className="absolute md:top-[180px]  md:left-[20px] bg-gray-700 text-white p-6 md:rounded-lg w-full md:w-[47%]">
                    <h2 className="text-lg font-bold">Submission Result:</h2>
                    {submissionResult.map((result, index) => (
                        <div key={index} className="mt-4">
                            <p>Test Case {index + 1}:</p>
                            <p>Input: {result.input}</p>
                            <p>Expected Output: {result.expectedOutput}</p>
                            <p>Actual Output: {result.actualOutput}</p>
                            <p>Compiler Output: {result.compile_output}</p>
                            <p>Status: {result.passed ? 'Passed' : 'Failed'}</p>
                        </div>
                    ))}
                    <button
                        className="mt-4 text-red-600 border-2 border-red-800 hover:bg-red-700 hover:text-white rounded p-2"
                        onClick={handleClearResult}
                    >
                        Clear Result
                    </button>
                </div>
            )}
        </>
    );
};

export default CodeSections;
