
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import socket from "../socket";
import Navbar from "./Navbar";

const ContestLeaderboard = () => {
  const [data, setData] = useState([]);
  const { id } = useParams();

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get(
        `https://codecamp-iffd.onrender.com/api/v1/users/contest-leaderboard/${id}`
      );
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLeaderboard();

   
    socket.on("leaderboardUpdated", (payload) => {
      if (payload.contestId === id) {
        console.log("Live leaderboard update");
        fetchLeaderboard();
      }
    });

    return () => {
      socket.off("leaderboardUpdated");
    };
  }, [id]);

  return (
    <>
    <Navbar />
    <div className="app-bg">
    <div className="app-shell">
      <div className="page-header">
        <p className="eyebrow">Live contest</p>
        <h1 className="page-title">Contest Leaderboard</h1>
        <p className="page-subtitle">Live rankings update as contest submissions are scored.</p>
      </div>

      <div className="table-wrap">
      <table className="app-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Score</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="font-semibold text-white">#{index + 1}</td>
              <td>{item.user.username}</td>
              <td className="font-semibold text-emerald-400">
                {item.totalScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </div>
    </>
  );
};

export default ContestLeaderboard;
