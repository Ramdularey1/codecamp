import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          "https://codecamp-iffd.onrender.com/api/v1/users/leaderboard"
        );
        setData(res.data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const topThree = data.slice(0, 3);

  return (
    <>
    <Navbar />
    <div className="app-bg">
    <div className="app-shell">
      <div className="page-header sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Rankings</p>
          <h1 className="page-title mt-2">Leaderboard</h1>
          <p className="page-subtitle mt-2">See who is leading the CodeCamp practice board.</p>
        </div>
        <div className="status-pill border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          {data.length} Coders
        </div>
      </div>

      {isLoading ? (
        <div className="panel p-8 text-center text-slate-400">Loading leaderboard...</div>
      ) : data.length === 0 ? (
        <div className="panel p-8 text-center text-slate-400">No leaderboard data available yet.</div>
      ) : (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            {topThree.map((item, index) => (
              <div
                key={item.user?._id || item.user?.username || index}
                className={`panel p-5 ${
                  index === 0 ? "border-emerald-500/40 bg-emerald-500/10" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="status-pill border-slate-700 bg-slate-950 text-slate-300">
                    Rank #{index + 1}
                  </span>
                  <span className="text-2xl font-bold text-emerald-300">
                    {item.totalScore}
                  </span>
                </div>
                <h2 className="mt-5 truncate text-xl font-bold text-white">
                  {item.user?.username || "Unknown User"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {index === 0 ? "Current top performer" : "Strong CodeCamp ranking"}
                </p>
              </div>
            ))}
          </div>

          <div className="table-wrap">
          <table className="app-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th className="text-right">Score</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={item.user?._id || item.user?.username || index} className="transition hover:bg-white/[0.03]">
                  <td>
                    <span className={`status-pill ${
                      index < 3
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-slate-700 bg-slate-950 text-slate-300"
                    }`}>
                      #{index + 1}
                    </span>
                  </td>
                  <td>
                    <div className="font-semibold text-white">{item.user?.username || "Unknown User"}</div>
                    <div className="text-xs text-slate-500">CodeCamp participant</div>
                  </td>
                  <td className="text-right text-lg font-bold text-emerald-400">
                    {item.totalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
    </div>
    </>
  );
};

export default Leaderboard;
