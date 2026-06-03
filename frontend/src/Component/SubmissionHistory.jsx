import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen bg-gray-900 p-4 text-white sm:p-6">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">Submission History</h1>

      {!userId && <p>Please login to view submissions</p>}

      {userId && submissions.length === 0 ? (
        <p>No submissions found</p>
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
                className="cursor-pointer rounded border border-gray-700 bg-gray-800 p-4 transition hover:bg-gray-700"
              >
                <h2 className="break-words text-base font-semibold sm:text-lg">
                  {sub.problem?.title || "Unknown Problem"}
                </h2>

                <p className="text-sm text-gray-400">
                  {new Date(sub.createdAt).toLocaleString()}
                </p>

                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={
                      status === "Accepted" ? "text-green-400" : "text-red-400"
                    }
                  >
                    {status}
                  </span>
                </p>

                {total > 0 && (
                  <p className="text-sm">
                    Passed {passed} / {total} test cases
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
