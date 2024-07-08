import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import Problem from "./Component/problem";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      
      <main className="bg-gradient-to-b from-[#383636] to-[#090909] h-[100%] w-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problem" element={<Problem />} />
          
         
        </Routes>
      </main>
    </Router>
  );
}


export default App
