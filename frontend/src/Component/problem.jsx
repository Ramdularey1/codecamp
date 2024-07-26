import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateAllProblems } from "../utils/allProblemSlice";
import axios from "axios";
import Navbar from "./Navbar";
import { useNavigate } from 'react-router-dom';

const Problem = () => {
  const [message, setMessage] = useState('');
  const [data, setData] = useState([]);
  const problems = useSelector((state) => state.allproblems.allProblems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/users/getproblem", { withCredentials: true });
        setData(response.data.data);
        dispatch(updateAllProblems(response.data.data));
      } catch (error) {
        console.log("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleSolveProblem = (id) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData) {
    
      navigate('/signup', { state: { from: 'solveProblem' } });
      return;
    }
    navigate(`/code/${id}`);
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center h-[100%] p-10">
        <div className="text-[#dbd7d7] bg-[#423f3f] w-10/12 flex flex-col p-5 ">
          <div className="relative">
            <h1 className="text-[30px] ">
              Top <br />
              <span className="text-green-600">DSA</span> Problem
            </h1>
            <div className="absolute right-16">
              {message && <p>{message}</p>}
            </div>
          </div>
          {data.length === 0 ? (
            <p>Loading...</p>
          ) : (
            data.map((item) => (
              <div key={item._id} className="flex flex-col mt-[50px] border-[#6e6b6b] p-4 border-b-2">
                <div className="flex justify-between sm:flex-row ">
                  <div>
                    <h1 className="text-[20px] font-bold">{item.title}</h1>
                    <div className="flex gap-3 mt-4">
                      <p className="text-green-600">Amazon</p>
                      <p className="text-green-600">Facebook</p>
                    </div>
                  </div>
                  <div>
                    <button
                      className="border-[2px] text-green-600 border-green-600 w-[180px] h-[40px] hover:bg-green-600 font-medium hover:text-white"
                      onClick={() => handleSolveProblem(item._id)}
                    >
                      Solve Problem
                    </button>
                    <p className="text-center mt-2">Medium</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Problem;
