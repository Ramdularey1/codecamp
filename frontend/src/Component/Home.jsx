import React from "react";
import Navbar from "./Navbar";
import Card from "./Card";
const Home = () => {
    return(
        <>
        <Navbar/>
        <div className="p-10">
        
        <div className="text-white mt-[100px] flex justify-center items-center flex-col">
            <h1 className="text-[45px] font-medium text-center">Welcome to <span className="text-green-700">CodeCamp!</span></h1>
            <p className="text-[20px] mt-[10px] text-center px-4 ">Unleash your coding potential and embark on a journey to innovate, achieve, master, challenge, and succeed!</p>
        </div>

        <Card customClass = "mt-[60px] text-white flex justify-center gap-2 flex-wrap"/>
        </div>
       
       <div className="h-[127px]">
        <h1 className="text-white "></h1>
       </div>

        </>
    )
}
export default Home
