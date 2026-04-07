import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ContestPage = () => {
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const { id } = useParams(); // ✅ dynamic contest id
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const fetchContest = async () => {
      try {
        const res = await axios.get(
          `https://codecamp-iffd.onrender.com/api/v1/users/contest/${id}`
        );

        const contestData = res.data.data;
        setContest(contestData);

        const end = new Date(contestData.endTime).getTime();

        // ⏱ Timer
        interval = setInterval(() => {
          const now = new Date().getTime();
          const diff = end - now;

          if (diff <= 0) {
            clearInterval(interval);
            setTimeLeft(0);
          } else {
            setTimeLeft(diff);
          }
        }, 1000);
      } catch (err) {
        console.log("Error fetching contest:", err);
      }
    };

    if (id) fetchContest();

    return () => clearInterval(interval); // ✅ cleanup
  }, [id]);

  // ⏱ format time
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    return `${h}h ${m}m ${s}s`;
  };

  if (!contest)
    return <p className="text-white p-6">Loading contest...</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      
      {/* 🔥 Header */}
      <h1 className="text-2xl font-bold mb-4">
        {contest.title}
      </h1>

      {/* 🔥 Timer */}
      <div className="mb-6 text-lg">
        ⏱ Time Left:{" "}
        <span className="text-red-400 font-bold">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* 🔥 Problems */}
      <div className="space-y-4">
        {contest.problems.map((p, index) => (
          <div
            key={p._id}
            className="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between items-center hover:bg-gray-700 transition"
          >
            <div>
              <p className="font-semibold">
                {index + 1}. {p.title}
              </p>
              <p className="text-gray-400 text-sm">
                {p.difficulty}
              </p>
            </div>

            <button
              onClick={() => navigate(`/code/${p._id}`)} // ✅ SPA navigation
              className="text-blue-400 hover:underline"
            >
              Solve →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestPage;