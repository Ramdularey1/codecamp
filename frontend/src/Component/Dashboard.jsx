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

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.data?._id;

  useEffect(() => {
    if (!userId) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/v1/users/stats/${userId}`
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
      <div className="p-6 bg-gray-900 min-h-screen text-white">
        Loading dashboard...
      </div>
    );
  }

  // 🔥 Graph Data
  const chartData = stats.recent.map((sub, index) => ({
    name: `#${index + 1}`,
    success: sub.result?.status === "Accepted" ? 1 : 0,
  }));

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      {/* 🔥 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 p-4 rounded text-center">
          <p className="text-gray-400">Total</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-gray-800 p-4 rounded text-center">
          <p className="text-gray-400">Accepted</p>
          <p className="text-green-400 text-xl font-bold">
            {stats.accepted}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded text-center">
          <p className="text-gray-400">Wrong</p>
          <p className="text-red-400 text-xl font-bold">
            {stats.wrong}
          </p>
        </div>

        <div className="bg-gray-800 p-4 rounded text-center">
          <p className="text-gray-400">Success %</p>
          <p className="text-blue-400 text-xl font-bold">
            {stats.successRate}%
          </p>
        </div>
      </div>

      {/* 🔥 Submission Graph */}
      <div className="bg-gray-800 p-4 rounded mb-6 border border-gray-700">
        <h2 className="font-bold mb-4">📈 Submission Trend</h2>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="success" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 Recent Activity */}
      <div>
        <h2 className="text-lg font-bold mb-4">Recent Activity</h2>

        {stats.recent.map((sub, index) => (
          <div
            key={index}
            className="bg-gray-800 p-3 rounded mb-2 border border-gray-700"
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
  );
};

export default Dashboard;