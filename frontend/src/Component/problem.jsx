import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateAllProblems } from "../utils/allProblemSlice";
import axios from "axios";
import Navbar from "./Navbar";

import ProblemCategory from "./ProblemCategory";

const Problem = () => {
  const problems = useSelector((state) => state.allproblems.allProblems);
  const [data, setData] = useState(problems);
  const [isLoading, setIsLoading] = useState(problems.length === 0);
  const dispatch = useDispatch();

  useEffect(() => {
    if (problems.length > 0) {
      setData(problems);
      setIsLoading(false);
    }
  }, [problems]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (problems.length === 0) {
        setIsLoading(true);
      }

      try {
        const response = await axios.get(
          "https://codecamp-iffd.onrender.com/api/v1/users/getproblem",
          { withCredentials: true },
        );
        const fetchedProblems = response.data.data || [];

        if (isMounted) {
          setData(fetchedProblems);
          setIsLoading(false);
        }

        dispatch(updateAllProblems(fetchedProblems));
      } catch (error) {
        console.log("Failed to fetch data", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <ProblemCategory data={data} isLoading={isLoading} />
    </>
  );
};

export default Problem;
