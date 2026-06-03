import axios from "axios";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateAllProblems } from "../utils/allProblemSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const problems = useSelector((state) => state.allproblems.allProblems);

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);
  const [isPrefetchingProblems, setIsPrefetchingProblems] = useState(false);

  const menuRef = useRef(null);
  const logoutRef = useRef(null);
  const buttonRef = useRef(null);
  const problemPrefetchAttemptedRef = useRef(false);

  // ✅ Contest ID (CHANGE THIS WHEN NEEDED)
  const contestId = "69d9e4c4cb98e5f970ab167a";

  const prefetchProblems = useCallback(async () => {
    if (
      problems.length > 0 ||
      isPrefetchingProblems ||
      problemPrefetchAttemptedRef.current
    ) {
      return;
    }

    problemPrefetchAttemptedRef.current = true;
    setIsPrefetchingProblems(true);
    try {
      const response = await axios.get(
        "https://codecamp-iffd.onrender.com/api/v1/users/getproblem",
        { withCredentials: true },
      );
      dispatch(updateAllProblems(response.data.data || []));
    } catch (error) {
      console.log("Failed to prefetch problems", error);
    } finally {
      setIsPrefetchingProblems(false);
    }
  }, [dispatch, isPrefetchingProblems, problems.length]);

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

  useEffect(() => {
    const timeoutId = setTimeout(prefetchProblems, 600);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [prefetchProblems]);

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
      <div className="sticky top-0 z-50 flex min-h-16 w-full items-center justify-between bg-black px-4 text-white sm:px-6 lg:px-10">
        <div className="shrink-0">
          <Link to={"/"}>
            <img
              className="h-14 w-20 object-contain"
              src="/codecamp.png"
              alt="logo"
            />
          </Link>
        </div>

        <div className="flex min-w-0 items-center justify-end">
          
          {/* 🔥 Desktop Menu */}
          <div className="hidden items-center gap-4 text-sm lg:flex xl:gap-6">
            <Link to="/problem" onFocus={prefetchProblems} onMouseEnter={prefetchProblems}>
              Problem
            </Link>
            <Link to="/submissions">Submissions</Link>
            <Link to="/compilar">Compilar</Link>

            {/* ✅ Contest Link */}
            <Link to={`/contest/${contestId}`}>Contest</Link>
            <Link to={`/contest/${contestId}/leaderboard`}>Contest Leaderboard</Link>

            <button onClick={handleAccount}>Account</button>

            {/* 🔥 Account Dropdown */}
            <div
              ref={logoutRef}
              className={`absolute right-4 top-16 z-[999] rounded-md bg-[#1d1c1c] shadow-lg sm:right-6 lg:right-10 ${
                isLogoutVisible ? "block" : "hidden"
              }`}
            >
              <div className="flex w-64 max-w-[calc(100vw-2rem)] flex-col items-center gap-2 p-4">
                <img
                  className="h-24 w-24 rounded-md object-cover"
                  src="/user.png"
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
          <div className="lg:hidden">
            <button
              ref={buttonRef}
              onClick={toggleMenu}
              className="rounded border border-gray-700 px-3 py-2 text-sm focus:outline-none"
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
          className="absolute right-0 top-16 z-50 flex w-full max-w-sm flex-col items-center bg-black p-4 text-white shadow-lg lg:hidden"
        >
          <Link
            to="/problem"
            className="py-2"
            onClick={toggleMenu}
            onTouchStart={prefetchProblems}
          >
            Problem
          </Link>
          <Link to="/submissions" className="py-2" onClick={toggleMenu}>
            Submissions
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
          <Link
            to={`/contest/${contestId}/leaderboard`}
            className="py-2"
            onClick={toggleMenu}
          >
            Contest Leaderboard
          </Link>
          <Link to="/leaderboard" className="py-2" onClick={toggleMenu}>
            Leaderboard
          </Link>
          <Link to="/dashboard" className="py-2" onClick={toggleMenu}>
            Dashboard
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
