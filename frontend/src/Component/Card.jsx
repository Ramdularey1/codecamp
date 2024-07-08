import React from "react";

const Card = ({customClass}) => {
    return(
        <div className ={customClass}>
           <div className="w-[300px] h-[300px] bg-[#1e1d1d] rounded-md flex flex-col">
            <div className="flex justify-start items-center h-[50%] pl-3 bg-green-700 rounded-t-md">
            <h1 className="text-[20px] gap-3 ">Top <br /><span className="text-[30px] text-red-300">DSA</span> Question</h1>
            </div>
            <div className="h-[50%] rounded-b-md flex justify-start  flex-col relative">
               <h1 className="text-[24px] ml-2">Upgrade Your concept</h1>
               <p className="ml-2 mt-4 text-[#605f5f]">Beginner to Advance</p>
               <button className="absolute right-2 bottom-2 text-green-700">Explore now</button>
            </div>
             
           </div>


           <div className="w-[300px] h-[300px] bg-[#1e1d1d] rounded-md flex flex-col">
            <div className="flex justify-start items-center h-[50%] pl-3 bg-green-700 rounded-t-md">
            <h1 className="text-[20px] gap-3 ">Top <br /><span className="text-[30px] text-red-300">DSA</span> Question</h1>
            </div>
            <div className="h-[50%] rounded-b-md flex justify-start  flex-col relative">
               <h1 className="text-[24px] ml-2">Upgrade Your concept</h1>
               <p className="ml-2 mt-4 text-[#605f5f]">Beginner to Advance</p>
               <button className="absolute right-2 bottom-2 text-green-700">Explore now</button>
            </div>
             
           </div>
           <div className="w-[300px] h-[300px] bg-[#1e1d1d] rounded-md flex flex-col">
            <div className="flex justify-start items-center h-[50%] pl-3 bg-green-700 rounded-t-md">
            <h1 className="text-[20px] gap-3 ">Top <br /><span className="text-[30px] text-red-300">DSA</span> Question</h1>
            </div>
            <div className="h-[50%] rounded-b-md flex justify-start  flex-col relative">
               <h1 className="text-[24px] ml-2">Upgrade Your concept</h1>
               <p className="ml-2 mt-4 text-[#605f5f]">Beginner to Advance</p>
               <button className="absolute right-2 bottom-2 text-green-700">Explore now</button>
            </div>
             
           </div>
           <div className="w-[300px] h-[300px] bg-[#1e1d1d] rounded-md flex flex-col">
            <div className="flex justify-start items-center h-[50%] pl-3 bg-green-700 rounded-t-md">
            <h1 className="text-[20px] gap-3 ">Top <br /><span className="text-[30px] text-red-300">DSA</span> Question</h1>
            </div>
            <div className="h-[50%] rounded-b-md flex justify-start  flex-col relative">
               <h1 className="text-[24px] ml-2">Upgrade Your concept</h1>
               <p className="ml-2 mt-4 text-[#605f5f]">Beginner to Advance</p>
               <button className="absolute right-2 bottom-2 text-green-700">Explore now</button>
            </div>
             
           </div>
        </div>
        
    )
}
export default Card;