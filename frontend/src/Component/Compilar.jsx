import React, { useEffect, useState } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";

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
    <div className="flex flex-col md:flex-row w-full h-screen">
      {/* Left */}
      <div className="flex flex-col md:w-1/2 w-full h-full">
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
        <div className="flex-1 pt-4 relative">
          <div className="h-full">
            <Editor
              height="calc(100vh - 140px)" // Adjust height based on padding and space for the button
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
          <div className="flex absolute right-4 bottom-[70px] justify-center mt-2">
            <button
              className="text-green-600 border-2 border-green-800 hover:bg-green-700 hover:text-white rounded p-2"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col md:w-1/2 w-full bg-gray-900 text-white p-4 h-full relative">
        <h1 className="mb-4 text-gray-300">Your result will appear here</h1>

        {submissionResult && (
          <div className="relative p-4 rounded-lg bg-gray-800 text-white font-mono text-sm h-full overflow-auto border border-gray-700">
            
            <button
              className="absolute top-3 right-3 text-red-400 border border-red-600 hover:bg-red-600 hover:text-white rounded px-3 py-1 text-sm"
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
  );
};

export default Compilar;
