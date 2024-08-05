import ProblemCategory from "./ProblemCategory"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";


const EasyProblem = () => {
    const [data, setData] = useState([]);

    const problems = useSelector((state) => state.allproblems.allProblems);
    const filterData = problems.filter((item) => {
        return item.difficulty === "Easy";
        
    })
    useEffect(() =>{
        setData(filterData)
    },[])
    
     console.log(data)
     console.log(problems)
    return(
        <>
        <Navbar/>
        <ProblemCategory data = {data}/>
        </>
    )
}
export default EasyProblem;