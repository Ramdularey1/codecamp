
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
    console.log(problems)

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
        console.log("selected problem", selectedProblem);
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

            <div className="flex flex-row h-screen">
                {/* Left section */}
                <div className="w-[50%] bg-gray-900 text-white overflow-auto">
                    <div className="p-6 border-b border-gray-700">
                        <h1 className="text-2xl font-bold">{currentProblem?.title}</h1>
                        <p className="text-sm mt-2 text-gray-400 font-medium">
                            Difficulty: <span className="font-extrabold">{currentProblem?.difficulty}</span>
                        </p>
                    </div>
                    <div className="p-6 text-gray-300">
                        <div>
                            <h3>{currentProblem?.description}</h3>
                        </div>
                        <div className="mt-6">
                            <h1 className="font-bold text-lg">Example:</h1>
                            {currentProblem?.testCases?.map((item, index) => (
                                <div key={index} className="mt-4 bg-gray-800 text-gray-300 rounded-md p-3 flex flex-col gap-2 border border-gray-700">
                                    <h1 className="font-semibold">Input: <span className="font-normal">{item.input}</span></h1>
                                    <h1 className="font-semibold">Output: <span className="font-normal">{item.output}</span></h1>
                                    <h1 className="font-semibold">Explanation: <span className="font-normal">{item.explanation}</span></h1>
                                </div>
                            ))}
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
                <div className="w-[50%] flex flex-col">
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
                                height="100%" 
                                language={languageId === 4 ? "java" : languageId === 54 ? "cpp" : "python"}
                                theme="vs-dark"
                                value={sourceCode}
                                onChange={(value) => setSourceCode(value)}
                                options={{
                                    minimap: { enabled: false },
                                    fontSize: 16,
                                }}
                            />
                        </div>
                        <div className="absolute right-10 top-[95%]">
                            <button
                                className="text-green-600 border-2 w-[100px] border-green-800 hover:bg-green-700 hover:text-white rounded"
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {submissionResult && (
                <div className="absolute top-[180px] left-[20px] bg-gray-700 text-white p-6 rounded-lg w-[47%]">
                    <h2 className="text-lg font-bold">Submission Result:</h2>
                    {submissionResult.map((result, index) => (
                        <div key={index} className="mt-4">
                            <p>Test Case {index + 1}:</p>
                            <p>Input: {result.input}</p>
                            <p>Expected Output: {result.expectedOutput}</p>
                            <p>Actual Output: {result.actualOutput}</p>
                            <p>Status: {result.passed ? 'Passed' : 'Failed'}</p>
                        </div>
                    ))}
                    <button
                        className="mt-4 text-red-600 border-2 w-[100px] border-red-800 hover:bg-red-700 hover:text-white rounded"
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



