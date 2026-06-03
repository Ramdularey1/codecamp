import React from "react";
import Navbar from "./Navbar";
import Card from "./Card";
const Home = () => {
    return(
        <>
        <Navbar/>
        <div className="px-4 py-10 sm:px-6 lg:px-10">
        
        <div className="mx-auto mt-12 flex max-w-5xl flex-col items-center justify-center text-white sm:mt-20">
            <h1 className="text-center text-3xl font-medium sm:text-4xl lg:text-5xl">Welcome to <span className="text-green-700">CodeCamp!</span></h1>
            <p className="mt-3 max-w-3xl px-2 text-center text-base sm:text-lg lg:text-xl">Unleash your coding potential and embark on a journey to innovate, achieve, master, challenge, and succeed!</p>
        </div>

        <Card customClass = "mx-auto mt-12 grid w-full max-w-7xl grid-cols-1 gap-4 text-white sm:grid-cols-2 lg:grid-cols-4"/>
        </div>
       
       <div className="h-16 sm:h-24">
        <h1 className="text-white "></h1>
       </div>

        </>
    )
}
export default Home



