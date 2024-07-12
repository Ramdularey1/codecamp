// import React, { useEffect } from "react";
// import Navbar from "./Navbar";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { updateCurrentProblem } from "../utils/currentProblem";

// const CodeSections = () => {
//   const dispatch = useDispatch();
//   const { id } = useParams();

//   const problems = useSelector((state) => state.allproblems.allProblems);
//   const currentProblem = useSelector((state) => state.currentProblem.currentProblem);

//   useEffect(() => {
//     const selectedProblem = problems.find((item) => item._id === id);
//     if (selectedProblem) {
//       dispatch(updateCurrentProblem(selectedProblem));
//     }
//   }, [dispatch, id, problems]);

//   console.log(id)
//   console.log("current", currentProblem)
//   return (
//     <>
//       <Navbar />
//       <div className="flex flex-row ">
//         <div className="w-[50%] bg-black text-white  ">
//           <div className="p-6 border-b-[1.5px] m-4 border-[#5a5a5a]">
//             <h1 className="text-[20px] font-bold">{currentProblem.title}</h1>
//             <p className="text-[13px] mt-[10px] text-[#5a5a5a] font-medium">Difficulty: <span className="font-[900]">{currentProblem.difficulty}</span></p>
//           </div>


//           <div className="p-6 text-[#797878]">
//             <div>
//               <h3>{currentProblem.description}</h3>
//             </div>

//             <div className="mt-[25px]">
//               <h1 className="font-bold">Example:</h1>

//               {(currentProblem.testCases).map((item) => {
//                 return (
//                   <div className="mt-4 bg-[#1c1c1c] text-[#797878] rounded-md p-3 flex flex-col gap-2 border-[1px] border-[#797878]">
//                     <h1 className="font-semibold">Input: <span className="font-normal">{item.input}</span> </h1>
//                     <h1 className="font-semibold">Output:<span className="font-normal">{item.output}</span> </h1>
//                     <h1 className="font-semibold">Explanation: <span className="font-normal">{item.explanation}</span></h1>
//                   </div>

//                 )
//               })}

//               <div className="mt-6">
//                 <h1 className="font-bold">Expected Time Complexity: <span className="font-normal">O(n)</span></h1>
//                 <h1 className="font-bold">Expected Auxiliary Space: <span className="font-normal">O(1)</span></h1>

//                 <h1 className="mt-4 font-bold">Constraints:</h1>

//                 <div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>


//         {/* input code */}
//         <div className="w-[50%] ">

//           <div>
//             <form >

//               <div className="bg-black text-black">
//                 <select className="bg-[#eae7e7] z-[999] rounded-sm outline-none"
//                 // value={languageId}
//                 // onChange={(e) => setLanguageId(e.target.value)}
//                 >
//                   <option value={1}>C</option>
//                   <option value={2}>C++</option>
//                   <option value={3}>Python</option>
//                   {/* Add more languages as needed */}
//                 </select>
//               </div>

//               <textarea
//   // value={sourceCode}
//   onChange={(e) => setSourceCode(e.target.value)}
//   placeholder="Write your code here..."
//   className="w-full h-[100vh] outline-none p-4 text-base border border-gray-300 rounded-md resize-none font-mono bg-gray-100"
// ></textarea>






//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default CodeSections;





import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentProblem } from "../utils/currentProblem";
import { Editor } from "@monaco-editor/react";

const CodeSections = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const problems = useSelector((state) => state.allproblems.allProblems);
  const currentProblem = useSelector((state) => state.currentProblem.currentProblem);
  
  const [sourceCode, setSourceCode] = useState("");
  const [languageId, setLanguageId] = useState("javascript");

  const boilerplateCode = {
    javascript: `// JavaScript boilerplate
function main() {
  console.log("Hello, World!");
}

main();`,
    cpp: `// C++ boilerplate
#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}`,
    python: `# Python boilerplate
def main():
  print("Hello, World!")

if __name__ == "__main__":
  main()`,
    // Add more boilerplate code as needed
  };

  useEffect(() => {
    const selectedProblem = problems.find((item) => item._id === id);
    if (selectedProblem) {
      dispatch(updateCurrentProblem(selectedProblem));
    }
  }, [dispatch, id, problems]);

  useEffect(() => {
    // Set the boilerplate code for the selected language
    setSourceCode(boilerplateCode[languageId]);
  }, [languageId]);

  return (
    <>
      <Navbar />
      <div className="flex flex-row h-screen">
        <div className="w-[50%] bg-gray-900 text-white overflow-auto">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold">{currentProblem?.title}</h1>
            <p className="text-sm mt-2 text-gray-400 font-medium">
              Difficulty: <span className="font-extrabold">{currentProblem?.difficulty}</span>
            </p>
          </div>
          <div className="p-6 text-gray-300">
            <div>
              <h3>{currentProblem?.description}</h3>
            </div>
            <div className="mt-6">
              <h1 className="font-bold text-lg">Example:</h1>
              {currentProblem?.testCases.map((item, index) => (
                <div key={index} className="mt-4 bg-gray-800 text-gray-300 rounded-md p-3 flex flex-col gap-2 border border-gray-700">
                  <h1 className="font-semibold">Input: <span className="font-normal">{item.input}</span></h1>
                  <h1 className="font-semibold">Output: <span className="font-normal">{item.output}</span></h1>
                  <h1 className="font-semibold">Explanation: <span className="font-normal">{item.explanation}</span></h1>
                </div>
              ))}
              <div className="mt-6">
                <h1 className="font-bold text-lg">Expected Time Complexity: <span className="font-normal">O(n)</span></h1>
                <h1 className="font-bold text-lg">Expected Auxiliary Space: <span className="font-normal">O(1)</span></h1>
                <h1 className="mt-4 font-bold text-lg">Constraints:</h1>
                <div>
                  {/* Add constraints content here */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[50%] flex flex-col">
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <select
              className="bg-gray-800 text-white rounded-sm outline-none p-2"
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
              {/* Add more languages as needed */}
            </select>
          </div>
          <div className="flex-1 pt-4">
            <div className="h-full">
              <Editor
                height="calc(100% - 16px)" // Adjust height based on padding
                language={languageId}
                theme="vs-dark"
                value={sourceCode}
                onChange={(value) => setSourceCode(value)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodeSections;
