import Navbar from "./Component/Navbar";
import Home from "./Component/Home";
import Problem from "./Component/problem";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import CodeSections from "./Component/CodeSection";
import { useNavigate } from "react-router-dom";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { store } from "./utils/store";
import { persistor } from "./utils/store";
function App() {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <main className="bg-gradient-to-b from-[#383636] to-[#090909] h-[100%] w-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/problem" element={<Problem />} />
            <Route path="/code/:id" element={<CodeSections />} />
          </Routes>
        </main>
      </Router>
    </PersistGate>
  </Provider>
  
  );
}


export default App
