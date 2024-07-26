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
        'https://judge0-extra-ce.p.rapidapi.com/submissions',
        {
          source_code: sourceCode,
          language_id: languageId,
          stdin: '', // Adjust this as necessary to provide input for the code
        },
        {
          headers: {
            'x-rapidapi-key': 'e1bf0af75amshab68da3c814f646p1daf8ejsn1b95b7e99d3c',
            'x-rapidapi-host': 'judge0-extra-ce.p.rapidapi.com',
            'Content-Type': 'application/json'
          },
          params: {
            base64_encoded: 'false',
            wait: 'true',
          },
        }
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
    <div className="flex w-full h-screen">
      {/* left */}
      <div className="w-1/2 flex flex-col">
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <select
            className="bg-gray-800 text-white rounded-sm outline-none p-2"
            value={languageId}
            onChange={(e) => setLanguageId(parseInt(e.target.value))}
          >
            <option value="4">Java</option>
            <option value="2">C++</option>
            <option value="28">Python</option>
            {/* Add more languages as needed */}
          </select>
        </div>
        <div className="flex-1 pt-4">
          <div className="h-full">
            <Editor
              height="100%" // Adjust height based on padding
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
          <div className="absolute left-[600px] top-[95%]">
            <button
              className="text-green-600 border-2 w-[100px] border-green-800 hover:bg-green-700 hover:text-white rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* right */}
      <div className="w-1/2 bg-black text-white p-4">
        <h1 className="mb-4">Your result will appear here</h1>
        {submissionResult && (
          <div className="p-4 rounded-lg bg-black text-white font-mono text-sm h-full overflow-auto">
            <h2 className="text-lg font-bold mb-4">Submission Result:</h2>
            <div className="mt-4">
              <p><span className="text-green-400">Status:</span> {submissionResult.status.description}</p>
              <p><span className="text-green-400">Output:</span> {submissionResult.stdout}</p>
              <p><span className="text-red-400">Error:</span> {submissionResult.stderr}</p>
            </div>
            <button
              className="mt-4 text-red-600 border-2 border-red-800 hover:bg-red-700 hover:text-white rounded p-2"
              onClick={handleClearResult}
            >
              Clear Result
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compilar;
