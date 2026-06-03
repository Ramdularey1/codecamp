import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";
import Navbar from "./Navbar";

const Compilar = () => {
  const [sourceCode, setSourceCode] = useState("");
  const [languageId, setLanguageId] = useState(4); // Default language ID for Java
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
    // Add more boilerplate code as needed
  };

  useEffect(() => {
    // Set the boilerplate code for the selected language
    setSourceCode(boilerplateCode[languageId]);
  }, [languageId]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://judge0-extra-ce.p.rapidapi.com/submissions",
        {
          source_code: sourceCode,
          language_id: languageId,
          stdin: "", // Adjust this as necessary to provide input for the code
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
        },
      );

      console.log("Submission response:", response.data);
      setSubmissionResult(response.data); // Set the result to state
    } catch (error) {
      console.error("Error submitting code:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request data:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      console.error("Error config:", error.config);
    }
  };

  const handleClearResult = () => {
    setSubmissionResult(null);
  };

  return (
    <>
    <Navbar />
    <div className="app-bg flex min-h-[calc(100vh-4rem)] w-full flex-col gap-4 p-4 lg:flex-row lg:p-6">
      {/* Left */}
      <div className="panel flex min-h-[70vh] w-full flex-col overflow-hidden lg:min-h-[calc(100vh-7rem)] lg:w-1/2">
        <div className="flex items-center justify-between border-b border-slate-800 bg-[#111827] p-4 text-white">
          <div>
            <p className="eyebrow">Compiler</p>
            <h1 className="mt-1 font-bold">Code Playground</h1>
          </div>
          <select
            className="field"
            value={languageId}
            onChange={(e) => setLanguageId(parseInt(e.target.value))}
          >
            <option value="4">Java</option>
            <option value="2">C++</option>
            <option value="28">Python</option>
            
          </select>
        </div>
        <div className="relative flex-1 bg-[#0f172a] pt-4">
          <div className="h-full">
            <Editor
              height="min(70vh, 640px)"
              language={
                languageId === 4 ? "java" : languageId === 2 ? "cpp" : "python"
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
          <div className="flex justify-center p-4 lg:absolute lg:bottom-6 lg:right-4 lg:p-0">
            <button
              className="primary-button"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="panel relative flex min-h-[50vh] w-full flex-col p-5 text-white lg:min-h-[calc(100vh-7rem)] lg:w-1/2">
        <p className="eyebrow">Output</p>
        <h1 className="mb-4 mt-1 font-bold">Your result will appear here</h1>

        {submissionResult && (
          <div className="panel-soft relative min-h-64 overflow-auto p-4 font-mono text-sm text-white lg:h-full">
            
            <button
              className="absolute right-3 top-3 rounded border border-red-500 px-3 py-1 text-sm text-red-300 hover:bg-red-600 hover:text-white"
              onClick={handleClearResult}
            >
              Clear
            </button>

           
            <h2 className="text-lg font-bold mb-4">
              Status:{" "}
              <span
                className={
                  submissionResult.status?.description === "Accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }
              >
                {submissionResult.status?.description || "Unknown"}
              </span>
            </h2>

            
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-green-400">Output:</span>{" "}
                {submissionResult.stdout || "—"}
              </p>

              <p>
                <span className="font-semibold text-red-400">Error:</span>{" "}
                {submissionResult.stderr || "—"}
              </p>

              {submissionResult.compile_output && (
                <p>
                  <span className="font-semibold text-yellow-400">
                    Compiler:
                  </span>{" "}
                  {submissionResult.compile_output}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Compilar;
