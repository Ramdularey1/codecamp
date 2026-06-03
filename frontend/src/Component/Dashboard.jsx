import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.data?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `https://codecamp-iffd.onrender.com/api/v1/users/stats/${userId}`
        );
        setStats(res.data);
      } catch (err) {
        console.log("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [userId]);

  if (!stats) {
    return (
      <>
        <Navbar />
        <div className="app-bg">
          <div className="app-shell text-slate-400">Loading dashboard...</div>
        </div>
      </>
    );
  }


  const chartData = stats.recent.map((sub, index) => ({
    name: `#${index + 1}`,
    success: sub.result?.status === "Accepted" ? 1 : 0,
  }));

  return (
    <>
    <Navbar />
    <div className="app-bg">
    <div className="app-shell">
      <div className="page-header">
        <p className="eyebrow">Your progress</p>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Track your submissions, acceptance rate, and recent problem-solving activity.</p>
      </div>

     
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="panel p-5">
          <p className="text-sm text-slate-400">Total</p>
          <p className="mt-2 text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="panel p-5">
          <p className="text-sm text-slate-400">Accepted</p>
          <p className="mt-2 text-3xl font-bold text-emerald-400">
            {stats.accepted}
          </p>
        </div>

        <div className="panel p-5">
          <p className="text-sm text-slate-400">Wrong</p>
          <p className="mt-2 text-3xl font-bold text-red-400">
            {stats.wrong}
          </p>
        </div>

        <div className="panel p-5">
          <p className="text-sm text-slate-400">Success %</p>
          <p className="mt-2 text-3xl font-bold text-sky-400">
            {stats.successRate}%
          </p>
        </div>
      </div>

     
      <div className="panel mb-6 p-5">
        <h2 className="mb-4 font-bold">Submission Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      
      <div>
        <h2 className="mb-4 text-lg font-bold">Recent Activity</h2>

        {stats.recent.map((sub, index) => (
          <div
            key={index}
            className="panel-soft mb-3 p-4"
          >
            <p className="font-semibold">
              {sub.problem?.title || "Problem"}
            </p>

            <p
              className={
                sub.result?.status === "Accepted"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {sub.result?.status}
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
    </>
  );
};

export default Dashboard;
