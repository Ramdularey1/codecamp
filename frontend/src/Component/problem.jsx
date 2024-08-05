import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateAllProblems } from "../utils/allProblemSlice";
import axios from "axios";
import Navbar from "./Navbar";

import ProblemCategory from "./ProblemCategory";

const Problem = () => {
  
  const [data, setData] = useState([]);
  const problems = useSelector((state) => state.allproblems.allProblems);
  const dispatch = useDispatch();
  

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

 

  return (
    <>
      <Navbar />
      <ProblemCategory data = {data}/>
    </>
  );
};

export default Problem;
