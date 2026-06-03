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
  const currentProblem = useSelector(
    (state) => state.currentProblem.currentProblem,
  );

  const [sourceCode, setSourceCode] = useState("");
  const [languageId, setLanguageId] = useState(4); 
  const [stdin, setStdin] = useState("");
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

  const user = JSON.parse(localStorage.getItem("user"));

  const userId = user.data._id;
  const contestId = "69d9e4c4cb98e5f970ab167a";
  const handleSubmit = async () => {
    try {
      const testCaseInputs = currentProblem.testCases.map(
        (testCase) => testCase.input,
      );
      const response = await axios.post(
        "https://codecamp-iffd.onrender.com/api/v1/users/submit-code",
        {
          problemId: id,
          userId: userId,
          source_code: sourceCode,
          language_id: languageId,
          stdin: testCaseInputs,
          contestId: contestId, 
        },
      );

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
      <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
        {/* Left section */}
        <div className="max-h-none w-full overflow-auto bg-gray-900 text-white lg:max-h-[calc(100vh-4rem)] lg:w-1/2">
          <div className="border-b border-gray-700 p-4 sm:p-6">
            <h1 className="break-words text-xl font-bold sm:text-2xl">
              {currentProblem?.title || "Loading..."}
            </h1>
            <p className="text-sm mt-2 text-gray-400 font-medium">
              Difficulty:{" "}
              <span className="font-extrabold">
                {currentProblem?.difficulty || "Loading..."}
              </span>
            </p>
          </div>
          <div className="p-4 text-gray-300 sm:p-6">
            <div>
              <h3>{currentProblem?.description || "Loading description..."}</h3>
            </div>
            <div className="mt-6">
              <h1 className="font-bold text-lg">Example:</h1>
              {currentProblem?.testCases?.length > 0 ? (
                currentProblem.testCases.map((item, index) => (
                  <div
                    key={index}
                    className="mt-4 flex flex-col gap-2 overflow-x-auto rounded-md border border-gray-700 bg-gray-800 p-3 text-gray-300"
                  >
                    <h1 className="font-semibold">
                      Input: <span className="font-normal">{item.input}</span>
                    </h1>
                    <h1 className="font-semibold">
                      Output: <span className="font-normal">{item.output}</span>
                    </h1>
                    <h1 className="font-semibold">
                      Explanation:{" "}
                      <span className="font-normal">{item.explanation}</span>
                    </h1>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No test cases available</p>
              )}
              <div className="mt-6">
                <h1 className="font-bold text-lg">
                  Expected Time Complexity:{" "}
                  <span className="font-normal">O(n)</span>
                </h1>
                <h1 className="font-bold text-lg">
                  Expected Auxiliary Space:{" "}
                  <span className="font-normal">O(1)</span>
                </h1>
                <h1 className="mt-4 font-bold text-lg">Constraints:</h1>
                <div>{/* Add constraints content here */}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex w-full flex-col lg:w-1/2">
          <div className="flex items-center justify-between bg-gray-900 p-4 text-white">
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
                height="min(70vh, 620px)"
                language={
                  languageId === 4
                    ? "java"
                    : languageId === 2
                      ? "cpp"
                      : "python"
                }
                theme="vs-dark"
                value={sourceCode}
                onChange={(value) => setSourceCode(value)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                }}
              />
            </div>
            <div className="flex justify-center p-4 lg:justify-end">
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
        <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-auto bg-gray-700 p-4 text-white shadow-2xl sm:p-6 lg:bottom-auto lg:left-5 lg:right-auto lg:top-44 lg:w-[47%] lg:rounded-lg">
          
          {(() => {
            const total = submissionResult.length;
            const passedCount = submissionResult.filter((t) => t.passed).length;
            const allPassed = total === passedCount;

            return (
              <div className="mb-4">
                <h2 className="text-xl font-bold">
                  Status:{" "}
                  <span
                    className={allPassed ? "text-green-400" : "text-red-400"}
                  >
                    {allPassed ? "Accepted ✅" : "Wrong Answer ❌"}
                  </span>
                </h2>

                <p className="text-sm text-gray-300">
                  Passed {passedCount} / {total} test cases
                </p>
              </div>
            );
          })()}

          <h2 className="text-lg font-bold mt-4">Submission Details:</h2>

        
          {submissionResult.map((result, index) => (
            <div
              key={index}
              className="mt-4 p-3 bg-gray-800 rounded border border-gray-600"
            >
              <p className="font-semibold">Test Case {index + 1}</p>

              <p>
                <span className="font-semibold">Input:</span> {result.input}
              </p>
              <p>
                <span className="font-semibold">Expected:</span>{" "}
                {result.expectedOutput}
              </p>
              <p>
                <span className="font-semibold">Actual:</span>{" "}
                {result.actualOutput}
              </p>

              <p className="mt-1">
                <span className="font-semibold">Status:</span>{" "}
                <span
                  className={result.passed ? "text-green-400" : "text-red-400"}
                >
                  {result.passed ? "Passed" : "Failed"}
                </span>
              </p>
            </div>
          ))}

          
          <button
            className="mt-4 text-red-400 border border-red-600 hover:bg-red-600 hover:text-white rounded px-3 py-1"
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
