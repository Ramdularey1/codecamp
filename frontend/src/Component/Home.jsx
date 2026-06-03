import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Card from "./Card";
const Home = () => {
    return(
        <>
        <Navbar/>
        <div className="app-bg">
        <div className="app-shell">
        
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-center py-14 text-center text-white sm:py-20">
            <p className="eyebrow">CodeCamp practice hub</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">Build your coding edge with <span className="text-emerald-400">focused practice</span></h1>
            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">Solve curated DSA problems, submit code, track progress, and compete with other learners from one clean workspace.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link className="primary-button" to="/problem">Start Solving</Link>
              <Link className="secondary-button" to="/leaderboard">View Leaderboard</Link>
            </div>
        </div>

        <Card customClass = "mx-auto mt-12 grid w-full max-w-7xl grid-cols-1 gap-4 text-white sm:grid-cols-2 lg:grid-cols-4"/>
        </div>
       </div>

        </>
    )
}
export default Home

