import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.data?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchSubmissions = async () => {
      try {
        const res = await axios.get(
          `https://codecamp-iffd.onrender.com/api/v1/users/submissions/${userId}`,
        );

        setSubmissions(res.data.data || []);
      } catch (err) {
        console.log("Error fetching submissions:", err);
      }
    };

    fetchSubmissions();
  }, [userId]);

  return (
    <>
    <Navbar />
    <div className="app-bg">
    <div className="app-shell">
      <div className="page-header">
        <p className="eyebrow">Submissions</p>
        <h1 className="page-title">Submission History</h1>
        <p className="page-subtitle">Review previous attempts and inspect detailed test results.</p>
      </div>

      {!userId && <p className="panel p-5 text-slate-400">Please login to view submissions</p>}

      {userId && submissions.length === 0 ? (
        <p className="panel p-5 text-slate-400">No submissions found</p>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub, index) => {
            const testResults = sub.result?.testCaseResults || [];

            const passed = testResults.filter((t) => t.passed).length;
            const total = testResults.length;

            const status =
              total > 0
                ? passed === total
                  ? "Accepted"
                  : "Wrong Answer"
                : sub.result?.status || "Unknown";

            return (
              <div
                key={index}
                onClick={() => navigate(`/submission/${sub._id}`)} // ✅ FIXED
                className="panel cursor-pointer p-4 transition hover:border-emerald-500/40"
              >
                <h2 className="break-words text-base font-semibold text-white sm:text-lg">
                  {sub.problem?.title || "Unknown Problem"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {new Date(sub.createdAt).toLocaleString()}
                </p>

                <p className="mt-3 text-sm text-slate-300">
                  Status{" "}
                  <span
                    className={
                      status === "Accepted" ? "font-semibold text-emerald-400" : "font-semibold text-red-400"
                    }
                  >
                    {status}
                  </span>
                </p>

                {total > 0 && (
                  <p className="mt-1 text-sm text-slate-400">
                    Passed {passed} / {total} test cases
                  </p>
                )}
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
