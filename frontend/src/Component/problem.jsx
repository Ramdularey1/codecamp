import React from "react";
import CodeSection from "./CodeSection";
import Navbar from "./Navbar";
const Problem = () => {
    return(
        <>
        <Navbar/>
        <div className="flex justify-center h-[100vh] p-10">
        <div className="text-[#dbd7d7] bg-[#423f3f] w-10/12 flex flex-col p-5 ">
        <div className="">
        <h1 className="text-[30px] ">Top <br /><span className="text-green-600">DSA</span> Problem</h1>
        </div>
          {/* Mapping */}
        <div className="flex flex-col mt-[50px] border-[#6e6b6b] p-4  border-b-2">
            <div className="flex justify-between">
                <div>
                <h1 className="text-[20px] font-bold">Indexes of Subarray Sum</h1>
                <div className="flex gap-3 mt-4">
                    <p className="text-green-600">Amazon</p>
                    <p className="text-green-600">Facebook</p>
                </div>
                </div>
                <div>
                <button className="border-[2px] text-green-600 border-green-600 w-[180px] h-[40px] hover:bg-green-600 font-medium hover:text-white">Solve Problem</button>
                <p className="text-center mt-2">Medium</p>
                </div>
                
            </div>

        </div>

        <div className="flex flex-col mt-[50px] border-[#6e6b6b] p-4  border-b-2">
            <div className="flex justify-between">
                <div>
                <h1 className="text-[20px] font-bold">Indexes of Subarray Sum</h1>
                <div className="flex gap-3 mt-4">
                    <p className="text-green-600">Amazon</p>
                    <p className="text-green-600">Facebook</p>
                </div>
                </div>
                <div>
                <button className="border-[2px] text-green-600 border-green-600 w-[180px] h-[40px] hover:bg-green-600 font-medium hover:text-white">Solve Problem</button>
                <p className="text-center mt-2">Medium</p>
                </div>
                
            </div>

        </div>
        </div>
        </div>
        
        

        
        </>
    )
}
export default Problem;