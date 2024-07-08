import React from "react";
import Navbar from "./Navbar";
import Card from "./Card";
const Home = () => {
    return(
        <>
        <Navbar/>
        <div className="text-white mt-[150px] flex justify-center items-center flex-col">
            <h1 className="text-[45px] font-medium text-center">Welcome to CodeCamp!</h1>
            <p className="text-[20px] mt-[10px] text-center px-4">Unleash your coding potential and embark on a journey to innovate, achieve, master, challenge, and succeed!</p>
        </div>

        <Card customClass = "mt-[60px] text-white flex justify-center gap-2 flex-wrap"/>

        </>
    )
}
export default Home
