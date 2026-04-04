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
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">Submission History</h1>

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
                className="p-4 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:bg-gray-700 transition"
              >
                <h2 className="font-semibold text-lg">
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
