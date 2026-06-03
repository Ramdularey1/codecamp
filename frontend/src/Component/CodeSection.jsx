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

  const userId = user?.data?._id;
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
      <div className="app-bg flex min-h-[calc(100vh-4rem)] flex-col gap-4 p-4 lg:flex-row lg:p-6">
        {/* Left section */}
        <div className="panel max-h-none w-full overflow-auto lg:max-h-[calc(100vh-7rem)] lg:w-1/2">
          <div className="border-b border-slate-800 p-4 sm:p-6">
            <p className="eyebrow">Problem</p>
            <h1 className="mt-2 break-words text-xl font-bold sm:text-2xl">
              {currentProblem?.title || "Loading..."}
            </h1>
            <p className="mt-3 text-sm font-medium text-slate-400">
              Difficulty:{" "}
              <span className="font-extrabold text-emerald-300">
                {currentProblem?.difficulty || "Loading..."}
              </span>
            </p>
          </div>
          <div className="p-4 text-slate-300 sm:p-6">
            <div>
              <h3>{currentProblem?.description || "Loading description..."}</h3>
            </div>
            <div className="mt-6">
              <h1 className="text-lg font-bold text-white">Examples</h1>
              {currentProblem?.testCases?.length > 0 ? (
                currentProblem.testCases.map((item, index) => (
                  <div
                    key={index}
                    className="panel-soft mt-4 flex flex-col gap-2 overflow-x-auto p-4 text-slate-300"
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
                <p className="text-slate-400">No test cases available</p>
              )}
              <div className="mt-6">
                <h1 className="text-lg font-bold text-white">
                  Expected Time Complexity:{" "}
                  <span className="font-normal text-slate-300">O(n)</span>
                </h1>
                <h1 className="text-lg font-bold text-white">
                  Expected Auxiliary Space:{" "}
                  <span className="font-normal text-slate-300">O(1)</span>
                </h1>
                <h1 className="mt-4 text-lg font-bold text-white">Constraints</h1>
                <div>{/* Add constraints content here */}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="panel flex w-full flex-col overflow-hidden lg:w-1/2">
          <div className="flex flex-col gap-3 border-b border-slate-800 bg-[#111827] p-4 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Editor</p>
              <select
                className="field mt-2 w-full sm:w-40"
                value={languageId}
                onChange={(e) => setLanguageId(parseInt(e.target.value))}
              >
                <option value="4">Java</option>
                <option value="2">C++</option>
                <option value="28">Python</option>
              </select>
            </div>

            <button
              className="primary-button w-full sm:w-auto"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
          <div className="flex-1 bg-[#0f172a] pt-4">
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
            <div className="flex justify-center border-t border-slate-800 p-4 sm:hidden">
              <button
                className="primary-button w-full"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      {submissionResult && (
        <div className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] overflow-auto border border-white/10 bg-[#111827] p-4 text-white shadow-2xl sm:p-6 lg:bottom-auto lg:left-5 lg:right-auto lg:top-44 lg:w-[47%] lg:rounded-lg">
          
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

                <p className="text-sm text-slate-300">
                  Passed {passedCount} / {total} test cases
                </p>
              </div>
            );
          })()}

          <h2 className="text-lg font-bold mt-4">Submission Details:</h2>

        
          {submissionResult.map((result, index) => (
            <div
              key={index}
              className="panel-soft mt-4 p-3"
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
            className="mt-4 rounded border border-red-500 px-3 py-1 text-red-300 hover:bg-red-600 hover:text-white"
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
