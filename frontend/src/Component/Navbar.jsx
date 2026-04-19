import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import userImage from "../../public/user.png";
import codecamp from "../../public/codecamp.png";

const Navbar = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  const menuRef = useRef(null);
  const logoutRef = useRef(null);
  const buttonRef = useRef(null);

  // ✅ Contest ID (CHANGE THIS WHEN NEEDED)
  const contestId = "69d9e4c4cb98e5f970ab167a";

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAccount = () => {
    setIsLogoutVisible((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      menuRef.current &&
      !menuRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target) &&
      logoutRef.current &&
      !logoutRef.current.contains(event.target)
    ) {
      setIsOpen(false);
      setIsLogoutVisible(false);
    }
  };

  useEffect(() => {
    if (isOpen || isLogoutVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLogoutVisible]);

  const handleClick = () => {
    navigate("/signup", { state: { from: "register" } });
  };

  const handleLogoutToggle = () => {
    setIsLogoutVisible((prev) => !prev);

    const logOut = async () => {
      try {
        const response = await axios.post(
          "https://codecamp-iffd.onrender.com/api/v1/users/logout",
          {},
          { withCredentials: true }
        );

        if (response.status >= 200 && response.status < 300) {
          localStorage.clear();
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    };

    logOut();
  };

  const loginUser = localStorage.getItem("user");
  const user = JSON.parse(loginUser);

  const handleLogin = () => {
    navigate("/signup", { state: { from: "login" } });
  };

  return (
    <>
      {/* 🔥 Navbar */}
      <div className="text-white flex justify-between items-center bg-black h-[60px]">
        <div className="mx-[40px]">
          <Link to={"/"}>
            <img
              className="w-[80px] h-[60px]"
              src={codecamp}
              alt="logo"
            />
          </Link>
        </div>

        <div className="mx-[40px] flex items-center justify-between w-full md:w-[600px]">
          
          {/* 🔥 Desktop Menu */}
          <div className="hidden md:flex items-center justify-around w-full">
            <Link to="/problem">Problem</Link>
            <Link to="/submissions">Submissions</Link>
            <Link to="/compilar">Compilar</Link>

            {/* ✅ Contest Link */}
            <Link to={`/contest/${contestId}`}>Contest</Link>
            <Link to={`/contest/${contestId}/leaderboard`}>Contest</Link>

            <button onClick={handleAccount}>Account</button>

            {/* 🔥 Account Dropdown */}
            <div
              ref={logoutRef}
              className={`z-[999] absolute bg-[#1d1c1c] top-12 right-[40px] ${
                isLogoutVisible ? "block" : "hidden"
              }`}
            >
              <div className="w-[250px] flex flex-col items-center p-4">
                <img
                  className="w-[100px] h-[100px] rounded-md"
                  src={userImage}
                  alt="user"
                />

                <h1>{user?.data?.username}</h1>
                <Link to = "/dashboard">Dashboard</Link>
                <Link to = "/leaderboard">Leaderboard</Link>
                {user ? (
                  <h1 className="cursor-pointer" onClick={handleLogoutToggle}>
                    Logout
                  </h1>
                ) : (
                  <h1 className="cursor-pointer" onClick={handleLogin}>
                    Login
                  </h1>
                )}
                
              </div>
            </div>
          </div>

          {/* 🔥 Mobile Menu Button */}
          <div className="md:hidden absolute right-0 mx-[40px]">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="focus:outline-none"
            >
              {isOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-black text-white flex flex-col items-center p-4 absolute right-0 w-[350px]"
        >
          <Link to="/problem" className="py-2" onClick={toggleMenu}>
            Problem
          </Link>

          {/* ✅ Contest Link */}
          <Link
            to={`/contest/${contestId}`}
            className="py-2"
            onClick={toggleMenu}
          >
            Contest
          </Link>

          <Link
            to="/compilar"
            className="py-2"
            onClick={toggleMenu}
          >
            Compilar
          </Link>

          <div className="py-2" onClick={toggleMenu}>
            {user ? (
              <h1 className="cursor-pointer" onClick={handleLogoutToggle}>
                Logout
              </h1>
            ) : (
              <h1 className="cursor-pointer" onClick={handleClick}>
                Register
              </h1>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;