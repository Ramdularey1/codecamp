import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

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
            
            setTimeLeft(start - now);
          } else if (now >= start && now <= end) {
            
            setTimeLeft(end - now);
          } else {
           
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


  const formatTime = (ms) => {
    if (ms <= 0) return "0h 0m 0s";

    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;

    return `${h}h ${m}m ${s}s`;
  };

  if (!contest)
    return (
      <>
        <Navbar />
        <div className="app-bg">
          <div className="app-shell text-slate-400">Loading contest...</div>
        </div>
      </>
    );

  const now = new Date().getTime();
  const start = new Date(contest.startTime).getTime();
  const end = new Date(contest.endTime).getTime();

  let status = "";
  if (now < start) status = "not_started";
  else if (now >= start && now <= end) status = "running";
  else status = "ended";

  return (
    <>
    <Navbar />
    <div className="app-bg">
    <div className="app-shell">
      <div className="page-header">
        <p className="eyebrow">Contest arena</p>
        <h1 className="page-title">{contest.title}</h1>
        <p className="page-subtitle">Review contest timing and solve active problems while the contest is running.</p>
      </div>

      <div className="panel mb-6 grid gap-4 p-5 sm:grid-cols-3">
        <div>
          <p className="text-sm text-slate-400">Starts At</p>
          <p className="mt-2 break-words font-semibold">
            {new Date(contest.startTime).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-400">Status</p>
          <span
            className={`status-pill mt-2 ${
              status === "running"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : status === "not_started"
                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                : "border-red-500/30 bg-red-500/10 text-red-300"
            }`}
          >
            {status === "running"
              ? "Running"
              : status === "not_started"
              ? "Not Started"
              : "Ended"}
          </span>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            {status === "not_started"
              ? "Starts In"
              : status === "running"
              ? "Time Left"
              : "Contest Ended"}
          </p>
          <p className="mt-2 text-2xl font-bold text-emerald-300">
            {formatTime(timeLeft)}
          </p>
        </div>
      </div>

    
      {status === "not_started" && (
        <p className="mb-4 rounded border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200">
          Contest will start at scheduled time
        </p>
      )}

      {status === "ended" && (
        <p className="mb-4 rounded border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          Contest has ended
        </p>
      )}

      
      <div className="space-y-4">
        {contest.problems?.map((p, index) => (
          <div
            key={p._id}
            className="panel flex flex-col gap-4 p-4 transition hover:border-emerald-500/40 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="break-words font-semibold text-white">
                {index + 1}. {p.title}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {p.difficulty}
              </p>
            </div>

            <button
              disabled={status !== "running"}
              onClick={() => navigate(`/code/${p._id}`)}
              className={`secondary-button ${
                status !== "running"
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {status === "ended" ? "Closed" : "Solve →"}
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
    </>
  );
};

export default ContestPage;
