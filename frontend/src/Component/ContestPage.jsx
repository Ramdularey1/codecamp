import React, { useEffect, useState } from "react";
import axios from "axios";

const ContestPage = () => {
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const contestId = "YOUR_CONTEST_ID"; // replace with real id

  useEffect(() => {
    const fetchContest = async () => {
      try {
        const res = await axios.get(
          `https://codecamp-iffd.onrender.com/api/v1/users/contest/${contestId}`
        );

        setContest(res.data.data);

        const end = new Date(res.data.data.endTime).getTime();

        const interval = setInterval(() => {
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
        console.log(err);
      }
    };

    fetchContest();
  }, []);

  // ⏱ format time
  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    return `${h}h ${m}m ${s}s`;
  };

  if (!contest) return <p className="text-white p-6">Loading contest...</p>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* 🔥 Title */}
      <h1 className="text-2xl font-bold mb-4">{contest.title}</h1>

      {/* 🔥 Timer */}
      <div className="mb-6 text-lg">
        ⏱ Time Left:{" "}
        <span className="text-red-400 font-bold">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* 🔥 Problems */}
      <div className="space-y-3">
        {contest.problems.map((p, index) => (
          <div
            key={index}
            className="bg-gray-800 p-4 rounded border border-gray-700"
          >
            <p className="font-semibold">{p.title}</p>
            <p className="text-gray-400">{p.difficulty}</p>

            <button
              className="mt-2 text-blue-400 underline"
              onClick={() => window.location.href = `/code/${p._id}`}
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