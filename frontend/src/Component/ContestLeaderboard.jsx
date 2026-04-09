// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";

// const ContestLeaderboard = () => {
//   const [data, setData] = useState([]);
//   const { id } = useParams();
//  console.log("Contest ID:", id); // ✅ Debugging line
// //  const contestId = "69d60fe16d266cc86f1de2c5";
//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         const res = await axios.get(
//           `https://codecamp-iffd.onrender.com/api/v1/users/contest-leaderboard/${id}`
//         );
//         setData(res.data.data);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchLeaderboard();
//   }, [id]);

//   return (
//     <div className="p-6 bg-gray-900 min-h-screen text-white">
//       <h1 className="text-2xl font-bold mb-6">🏆 Contest Leaderboard</h1>

//       <table className="w-full border border-gray-700">
//         <thead>
//           <tr className="bg-gray-800">
//             <th className="p-2">Rank</th>
//             <th className="p-2">User</th>
//             <th className="p-2">Score</th>
//           </tr>
//         </thead>

//         <tbody>
//           {data.map((item, index) => (
//             <tr key={index} className="text-center border-t border-gray-700">
//               <td className="p-2">{index + 1}</td>
//               <td className="p-2">{item.user.username}</td>
//               <td className="p-2 text-green-400">
//                 {item.totalScore}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ContestLeaderboard;






import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
// import socket from "../socket";
import socket from "../socket"; // ✅ import socket instance

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

    // 🔥 LISTEN FOR REAL-TIME UPDATE
    socket.on("leaderboardUpdated", (payload) => {
      if (payload.contestId === id) {
        console.log("🔥 Live leaderboard update");
        fetchLeaderboard();
      }
    });

    return () => {
      socket.off("leaderboardUpdated");
    };
  }, [id]);

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-6">🏆 Live Contest Leaderboard</h1>

      <table className="w-full border border-gray-700">
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
  );
};

export default ContestLeaderboard;