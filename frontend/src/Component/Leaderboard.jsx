import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get(
          "https://codecamp-iffd.onrender.com/api/v1/users/leaderboard"
        );
        setData(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <>
    <Navbar />
    <div className="app-bg">
    <div className="app-shell">
      <div className="page-header">
        <p className="eyebrow">Rankings</p>
        <h1 className="page-title">Leaderboard</h1>
        <p className="page-subtitle">See who is leading the CodeCamp practice board.</p>
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

export default Leaderboard;
