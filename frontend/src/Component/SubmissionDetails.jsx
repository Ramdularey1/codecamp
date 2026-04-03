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
          `http://localhost:8000/api/v1/users/getproblemById/${id}`
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
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      
      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {submission.problem?.title || "Unknown Problem"}
        </h1>

        <button
          onClick={() => navigate(`/code/${submission.problem?._id}`)}
          className="text-blue-400 hover:underline"
        >
          Solve Again →
        </button>
      </div>

      {/* 🔥 STATUS + SUMMARY */}
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

      {/* 🔥 CODE BLOCK */}
      <div className="bg-black p-4 rounded mb-6 border border-gray-700 overflow-auto">
        <h2 className="font-bold mb-2">Submitted Code:</h2>
        <pre className="text-green-400 whitespace-pre-wrap text-sm">
          {submission.source_code}
        </pre>
      </div>

      {/* 🔥 TEST CASE RESULTS */}
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