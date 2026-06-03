import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const API_BASE = "https://codecamp-iffd.onrender.com/api/v1/users";
const LOCAL_CONTESTS_KEY = "codecamp-created-contests";

const ContestList = () => {
  const [contests, setContests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchContests = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const localContests = JSON.parse(
        localStorage.getItem(LOCAL_CONTESTS_KEY) || "[]",
      );

      try {
        const response = await axios.get(`${API_BASE}/contests`);
        const remoteContests = response.data.data || [];
        const localOnlyContests = localContests.filter(
          (localContest) =>
            !remoteContests.some((contest) => contest._id === localContest._id),
        );
        setContests([...localOnlyContests, ...remoteContests]);
      } catch (error) {
        console.log("Failed to fetch contests", error);
        setContests(localContests);
        setErrorMessage(
          localContests.length > 0
            ? "Showing recently created contests from this browser."
            : "Unable to load contests. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, []);

  const getStatus = (contest) => {
    const now = Date.now();
    const start = new Date(contest.startTime).getTime();
    const end = new Date(contest.endTime).getTime();

    if (now < start) return "Not Started";
    if (now >= start && now <= end) return "Running";
    return "Ended";
  };

  const getStatusClasses = (status) => {
    if (status === "Running") {
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    }
    if (status === "Not Started") {
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    }
    return "border-red-500/30 bg-red-500/10 text-red-300";
  };

  return (
    <>
      <Navbar />
      <div className="app-bg">
        <div className="app-shell">
          <div className="page-header sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Contest hub</p>
              <h1 className="page-title mt-2">Available Contests</h1>
              <p className="page-subtitle mt-2">
                Newly created contests appear here so users can open them and solve active problems.
              </p>
            </div>
            <span className="status-pill border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              {contests.length} Contests
            </span>
          </div>

          {errorMessage && (
            <p className="mb-6 rounded border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-200">
              {errorMessage}
            </p>
          )}

          {isLoading ? (
            <div className="panel p-8 text-center text-slate-400">
              Loading contests...
            </div>
          ) : contests.length === 0 ? (
            <div className="panel p-8 text-center text-slate-400">
              No contests available yet.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {contests.map((contest) => {
                const status = getStatus(contest);

                return (
                  <div key={contest._id} className="panel p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="break-words text-xl font-bold text-white">
                          {contest.title}
                        </h2>
                        <p className="mt-2 text-sm text-slate-400">
                          {contest.problems?.length || 0} problems
                        </p>
                      </div>
                      <span className={`status-pill ${getStatusClasses(status)}`}>
                        {status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                      <div className="panel-soft p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Starts
                        </p>
                        <p className="mt-1 text-slate-200">
                          {new Date(contest.startTime).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })}
                        </p>
                      </div>
                      <div className="panel-soft p-3">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Ends
                        </p>
                        <p className="mt-1 text-slate-200">
                          {new Date(contest.endTime).toLocaleString("en-IN", {
                            timeZone: "Asia/Kolkata",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                      <Link className="primary-button" to={`/contest/${contest._id}`}>
                        Open Contest
                      </Link>
                      <Link
                        className="secondary-button"
                        to={`/contest/${contest._id}/leaderboard`}
                      >
                        Leaderboard
                      </Link>
                    </div>
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

export default ContestList;
