import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axios.get(
          `https://codecamp-iffd.onrender.com/api/v1/users/getproblemById/${id}`
        );
        setSubmission(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSubmission();
  }, [id]);

  if (!submission)
    return <p className="text-white p-6">Loading...</p>;

  const testCases = submission.result?.testCaseResults || [];
  const passedCount = testCases.filter((t) => t.passed).length;
  const total = testCases.length;

  return (
    <div className="min-h-screen bg-gray-900 p-4 text-white sm:p-6">
      
    
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="break-words text-xl font-bold sm:text-2xl">
          {submission.problem?.title || "Unknown Problem"}
        </h1>

        <button
          onClick={() => navigate(`/code/${submission.problem?._id}`)}
          className="text-blue-400 hover:underline"
        >
          Solve Again →
        </button>
      </div>

     
      <div className="mb-4">
        <p>
          Status:{" "}
          <span
            className={
              submission.result?.status === "Accepted"
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {submission.result?.status || "Unknown"}
          </span>
        </p>

        {total > 0 && (
          <p className="text-gray-300 text-sm">
            Passed {passedCount} / {total} test cases
          </p>
        )}
      </div>

      
      <div className="mb-6 overflow-auto rounded border border-gray-700 bg-black p-4">
        <h2 className="font-bold mb-2">Submitted Code:</h2>
        <pre className="whitespace-pre-wrap break-words text-sm text-green-400">
          {submission.source_code}
        </pre>
      </div>

      
      {testCases.length > 0 && (
        <div>
          <h2 className="font-bold mb-3">Test Case Results:</h2>

          {testCases.map((t, i) => (
            <div
              key={i}
              className="bg-gray-800 p-4 rounded mb-3 border border-gray-700"
            >
              <p>
                <span className="font-semibold">Input:</span> {t.input}
              </p>
              <p>
                <span className="font-semibold">Expected:</span> {t.expectedOutput}
              </p>
              <p>
                <span className="font-semibold">Actual:</span> {t.actualOutput}
              </p>

              <p
                className={
                  t.passed
                    ? "text-green-400 font-semibold mt-1"
                    : "text-red-400 font-semibold mt-1"
                }
              >
                {t.passed ? "Passed ✅" : "Failed ❌"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionDetails;
