import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(JSON.parse(localStorage.getItem("user"))?.data?._id));
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const loginUser = localStorage.getItem("user");
  const user = loginUser ? JSON.parse(loginUser) : null;
  const userId = user?.data?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchSubmissions = async () => {
      setIsLoading(true);
      setErrorMessage("");
      try {
        const res = await axios.get(
          `https://codecamp-iffd.onrender.com/api/v1/users/submissions/${userId}`,
        );

        setSubmissions(res.data.data || []);
      } catch (err) {
        console.log("Error fetching submissions:", err);
        setErrorMessage("Unable to load submissions. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [userId]);

  const getSubmissionStatus = (sub) => {
    const testResults = sub.result?.testCaseResults || [];
    const passed = testResults.filter((t) => t.passed).length;
    const total = testResults.length;
    const status =
      total > 0
        ? passed === total
          ? "Accepted"
          : "Wrong Answer"
        : sub.result?.status || "Unknown";

    return { passed, total, status };
  };

  const acceptedCount = submissions.filter(
    (sub) => getSubmissionStatus(sub).status === "Accepted",
  ).length;
  const wrongCount = submissions.filter(
    (sub) => getSubmissionStatus(sub).status !== "Accepted",
  ).length;

  return (
    <>
    <Navbar />
    <div className="app-bg">
    <div className="app-shell">
      <div className="page-header sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Submissions</p>
          <h1 className="page-title mt-2">Submission History</h1>
          <p className="page-subtitle mt-2">Review previous attempts, status, and test-case performance.</p>
        </div>
        <div className="status-pill border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          {submissions.length} Attempts
        </div>
      </div>

      {!userId && <p className="panel p-8 text-center text-slate-400">Please login to view submissions.</p>}

      {userId && (
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="panel p-5">
            <p className="text-sm text-slate-400">Total Attempts</p>
            <p className="mt-2 text-3xl font-bold text-white">{submissions.length}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-slate-400">Accepted</p>
            <p className="mt-2 text-3xl font-bold text-emerald-400">{acceptedCount}</p>
          </div>
          <div className="panel p-5">
            <p className="text-sm text-slate-400">Needs Review</p>
            <p className="mt-2 text-3xl font-bold text-red-400">{wrongCount}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <p className="mb-6 rounded border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          {errorMessage}
        </p>
      )}

      {userId && isLoading ? (
        <p className="panel p-8 text-center text-slate-400">Loading submissions...</p>
      ) : userId && submissions.length === 0 ? (
        <p className="panel p-8 text-center text-slate-400">No submissions found.</p>
      ) : (
        userId && <div className="grid gap-4 lg:grid-cols-2">
          {submissions.map((sub, index) => {
            const { passed, total, status } = getSubmissionStatus(sub);
            const isAccepted = status === "Accepted";

            return (
              <div
                key={sub._id || index}
                onClick={() => navigate(`/submission/${sub._id}`)} // ✅ FIXED
                className="panel cursor-pointer p-5 transition hover:-translate-y-1 hover:border-emerald-500/40"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Attempt #{submissions.length - index}
                    </p>
                    <h2 className="mt-2 break-words text-base font-semibold text-white sm:text-lg">
                      {sub.problem?.title || "Unknown Problem"}
                    </h2>
                  </div>

                  <span
                    className={`status-pill shrink-0 ${
                      isAccepted
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-red-500/30 bg-red-500/10 text-red-300"
                    }`}
                  >
                    {status}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                  <div className="panel-soft p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Submitted</p>
                    <p className="mt-1 text-slate-200">{new Date(sub.createdAt).toLocaleString()}</p>
                  </div>

                  <div className="panel-soft p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">Test Cases</p>
                    <p className="mt-1 text-slate-200">
                      {total > 0 ? `${passed} / ${total} passed` : "No case data"}
                    </p>
                  </div>
                </div>

                <button className="mt-5 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
                  View Details →
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default SubmissionHistory;
