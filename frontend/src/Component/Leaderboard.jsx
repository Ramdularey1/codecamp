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
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">🏆 Leaderboard</h1>

      <div className="space-y-3">
        {data.map((user, index) => (
          <div
            key={index}
            className="flex justify-between bg-gray-800 p-4 rounded border border-gray-700"
          >
            <div>
              <p className="font-bold">
                #{index + 1} {user._id?.name || "User"}
              </p>
              <p className="text-sm text-gray-400">
                {user._id?.email}
              </p>
            </div>

            <p className="text-green-400 font-bold">
              {user.solved} solved
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;