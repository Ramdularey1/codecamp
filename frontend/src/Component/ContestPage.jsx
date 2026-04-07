import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ContestPage = () => {
  const [contest, setContest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;

    const fetchContest = async () => {
      try {
        const res = await axios.get(
          `https://codecamp-iffd.onrender.com/api/v1/users/contest/${id}`
        );

        const contestData = res.data?.data;
        if (!contestData) return;

        setContest(contestData);

        const start = new Date(contestData.startTime).getTime();
        const end = new Date(contestData.endTime).getTime();

        const updateTimer = () => {
          const now = new Date().getTime();

          if (now < start) {
            // before start → countdown to start
            setTimeLeft(start - now);
          } else if (now >= start && now <= end) {
            // running → countdown to end
            setTimeLeft(end - now);
          } else {
            // ended
            setTimeLeft(0);
            clearInterval(interval);
          }
        };

        updateTimer();
        interval = setInterval(updateTimer, 1000);
      } catch (err) {
        console.log("Error fetching contest:", err);
      }
    };

    if (id) fetchContest();

    return () => clearInterval(interval);
  }, [id]);

  // ⏱ format time
  const formatTime = (ms) => {
    if (ms <= 0) return "0h 0m 0s";

    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    return `${h}h ${m}m ${s}s`;
  };

  if (!contest)
    return <p className="text-white p-6">Loading contest...</p>;

  const now = new Date().getTime();
  const start = new Date(contest.startTime).getTime();
  const end = new Date(contest.endTime).getTime();

  let status = "";
  if (now < start) status = "not_started";
  else if (now >= start && now <= end) status = "running";
  else status = "ended";

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      
      {/* 🔥 Title */}
      <h1 className="text-2xl font-bold mb-2">{contest.title}</h1>

      {/* 🔥 Start Time (IST) */}
      <p className="mb-2 text-gray-300">
        Starts At:{" "}
        <span className="font-semibold">
          {new Date(contest.startTime).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          })}
        </span>
      </p>

      {/* 🔥 Status */}
      <p className="mb-2">
        Status:{" "}
        <span
          className={
            status === "running"
              ? "text-green-400"
              : status === "not_started"
              ? "text-yellow-400"
              : "text-red-400"
          }
        >
          {status === "running"
            ? "Running"
            : status === "not_started"
            ? "Not Started"
            : "Ended"}
        </span>
      </p>

      {/* 🔥 Timer */}
      <div className="mb-6 text-lg">
        ⏱{" "}
        {status === "not_started"
          ? "Starts In:"
          : status === "running"
          ? "Time Left:"
          : "Contest Ended"}{" "}
        <span className="text-red-400 font-bold">
          {formatTime(timeLeft)}
        </span>
      </div>

      {/* 🔥 Messages */}
      {status === "not_started" && (
        <p className="text-yellow-400 mb-4">
          Contest will start at scheduled time
        </p>
      )}

      {status === "ended" && (
        <p className="text-red-400 mb-4">
          Contest has ended
        </p>
      )}

      {/* 🔥 Problems */}
      <div className="space-y-4">
        {contest.problems?.map((p, index) => (
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
              disabled={status !== "running"}
              onClick={() => navigate(`/code/${p._id}`)}
              className={`text-blue-400 ${
                status !== "running"
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:underline"
              }`}
            >
              {status === "ended" ? "Closed" : "Solve →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContestPage;