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
          `http://localhost:8000/api/v1/users/getproblemById/${id}`,
        );
        setSubmission(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSubmission();
  }, [id]);

  if (!submission) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* 🔥 Problem Title */}
      <h1 className="text-2xl font-bold mb-2">{submission.problem?.title}</h1>

      {/* 🔥 Solve Again Button */}
      <button
        onClick={() => navigate(`/code/${submission.problem?._id}`)}
        className="mb-4 text-blue-400 underline"
      >
        Solve Again →
      </button>

      {/* 🔥 Status */}
      <p className="mb-4">
        Status:{" "}
        <span
          className={
            submission.result?.status === "Accepted"
              ? "text-green-400"
              : "text-red-400"
          }
        >
          {submission.result?.status}
        </span>
      </p>

      {/* 🔥 Code */}
      <div className="bg-black p-4 rounded overflow-auto">
        <h2 className="font-bold mb-2">Submitted Code:</h2>
        <pre className="text-green-400 whitespace-pre-wrap">
          {submission.source_code}
        </pre>
      </div>

      {/* 🔥 Test Case Results */}
      {submission.result?.testCaseResults && (
        <div className="mt-6">
          <h2 className="font-bold mb-2">Test Case Results:</h2>

          {submission.result.testCaseResults.map((t, i) => (
            <div
              key={i}
              className="bg-gray-800 p-3 rounded mt-2 border border-gray-700"
            >
              <p>Input: {t.input}</p>
              <p>Expected: {t.expectedOutput}</p>
              <p>Actual: {t.actualOutput}</p>
              <p className={t.passed ? "text-green-400" : "text-red-400"}>
                {t.passed ? "Passed" : "Failed"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionDetails;
