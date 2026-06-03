import React, { useEffect, useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen bg-gray-900 p-4 text-white sm:p-6">
      <h1 className="mb-6 text-xl font-bold sm:text-2xl">🏆 Leaderboard</h1>

      <div className="overflow-x-auto">
      <table className="min-w-[520px] w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-2">Rank</th>
            <th className="p-2">User</th>
            <th className="p-2">Score</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="text-center border-t border-gray-700">
              <td className="p-2">{index + 1}</td>
              <td className="p-2">{item.user.username}</td>
              <td className="p-2 text-green-400">
                {item.totalScore}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Leaderboard;
