import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const res = await axios.get(
          `https://codecamp-iffd.onrender.com/api/v1/users/getproblemById/${id}`
        );
        setSubmission(res.data.data);
      } catch (err) {
        console.log(err);
        setErrorMessage("Unable to load submission details.");
      }
    };

    fetchSubmission();
  }, [id]);

  if (!submission)
    return (
      <>
        <Navbar />
        <div className="app-bg">
          <div className="app-shell text-slate-400">
            {errorMessage || "Loading submission details..."}
          </div>
        </div>
      </>
    );

  const testCases = submission.result?.testCaseResults || [];
  const passedCount = testCases.filter((t) => t.passed).length;
  const total = testCases.length;
  const status = total > 0
    ? passedCount === total
      ? "Accepted"
      : "Wrong Answer"
    : submission.result?.status || "Unknown";
  const isAccepted = status === "Accepted";

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
        <p className="page-subtitle mt-2">
          Inspect your submitted code and compare each test-case result.
        </p>
        </div>

        <button
          onClick={() => navigate(`/code/${submission.problem?._id}`)}
          className="secondary-button"
        >
          Solve Again →
        </button>
      </div>

     
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="text-sm text-slate-400">Status</p>
          <span
            className={`status-pill mt-3 ${
              isAccepted
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {status}
          </span>
        </div>

        <div className="panel p-5">
          <p className="text-sm text-slate-400">Passed Cases</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">{passedCount}</p>
        </div>

        <div className="panel p-5">
          <p className="text-sm text-slate-400">Total Cases</p>
          <p className="mt-2 text-3xl font-bold text-white">{total}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel overflow-hidden">
          <div className="border-b border-slate-800 p-4">
            <h2 className="font-bold">Submitted Code</h2>
          </div>
          <div className="max-h-[560px] overflow-auto bg-slate-950 p-4">
            <pre className="whitespace-pre-wrap break-words text-sm leading-6 text-emerald-300">
              {submission.source_code}
            </pre>
          </div>
        </div>

      
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold">Test Case Results</h2>
            <span className="text-sm text-slate-400">{passedCount} / {total}</span>
          </div>

          {testCases.length > 0 ? testCases.map((t, i) => (
            <div
              key={i}
              className="panel-soft mb-3 p-4"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-semibold text-white">Case {i + 1}</p>
                <span
                  className={`status-pill ${
                    t.passed
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/30 bg-red-500/10 text-red-300"
                  }`}
                >
                  {t.passed ? "Passed" : "Failed"}
                </span>
              </div>
              <p className="break-words text-sm text-slate-300">
                <span className="font-semibold text-slate-100">Input:</span> {t.input}
              </p>
              <p className="mt-2 break-words text-sm text-slate-300">
                <span className="font-semibold text-slate-100">Expected:</span> {t.expectedOutput}
              </p>
              <p className="mt-2 break-words text-sm text-slate-300">
                <span className="font-semibold text-slate-100">Actual:</span> {t.actualOutput}
              </p>
            </div>
          )) : (
            <div className="panel-soft p-4 text-slate-400">No test-case details available.</div>
          )}
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default SubmissionDetails;
