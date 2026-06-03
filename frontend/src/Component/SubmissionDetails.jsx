import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

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
    return (
      <>
        <Navbar />
        <div className="app-bg">
          <div className="app-shell text-slate-400">Loading...</div>
        </div>
      </>
    );

  const testCases = submission.result?.testCaseResults || [];
  const passedCount = testCases.filter((t) => t.passed).length;
  const total = testCases.length;

  return (
    <>
    <Navbar />
    <div className="app-bg">
    <div className="app-shell">
      
    
      <div className="page-header sm:flex-row sm:items-start sm:justify-between">
        <div>
        <p className="eyebrow">Submission details</p>
        <h1 className="page-title mt-2">
          {submission.problem?.title || "Unknown Problem"}
        </h1>
        </div>

        <button
          onClick={() => navigate(`/code/${submission.problem?._id}`)}
          className="secondary-button"
        >
          Solve Again →
        </button>
      </div>

     
      <div className="panel mb-6 p-5">
        <p className="text-sm text-slate-400">
          Status{" "}
          <span
            className={
              submission.result?.status === "Accepted"
                ? "font-semibold text-emerald-400"
                : "font-semibold text-red-400"
            }
          >
            {submission.result?.status || "Unknown"}
          </span>
        </p>

        {total > 0 && (
          <p className="mt-2 text-sm text-slate-300">
            Passed {passedCount} / {total} test cases
          </p>
        )}
      </div>

      
      <div className="panel mb-6 overflow-auto p-4">
        <h2 className="mb-3 font-bold">Submitted Code</h2>
        <pre className="whitespace-pre-wrap break-words text-sm text-green-400">
          {submission.source_code}
        </pre>
      </div>

      
      {testCases.length > 0 && (
        <div>
          <h2 className="mb-3 font-bold">Test Case Results</h2>

          {testCases.map((t, i) => (
            <div
              key={i}
              className="panel-soft mb-3 p-4"
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
    </div>
    </>
  );
};

export default SubmissionDetails;
