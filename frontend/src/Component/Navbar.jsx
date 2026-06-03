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

  const handleLogoutToggle = async () => {
    setIsLogoutVisible(false);
    setIsOpen(false);

    try {
      await axios.post(
        "https://codecamp-iffd.onrender.com/api/v1/users/logout",
        {},
        { withCredentials: true },
      );
    } catch (error) {
      console.log(error);
    } finally {
      localStorage.clear();
      navigate("/");
    }
  };

  const loginUser = localStorage.getItem("user");
  const user = loginUser ? JSON.parse(loginUser) : null;
  const isAdminUser = user?.data?.email === "testadmin@gmail.com";

  const handleLogin = () => {
    navigate("/signup", { state: { from: "login" } });
  };

  return (
    <>
      {/* 🔥 Navbar */}
      <div className="fixed left-0 top-0 z-50 flex min-h-16 w-full items-center justify-between border-b border-white/10 bg-[#0b0f14]/95 px-4 text-white shadow-lg backdrop-blur sm:px-6 lg:px-10">
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
          <div className="hidden items-center gap-1 text-sm lg:flex">
            <Link className="rounded px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to="/problem" onFocus={prefetchProblems} onMouseEnter={prefetchProblems}>
              Problem
            </Link>
            <Link className="rounded px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to="/submissions">Submissions</Link>
            <Link className="rounded px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to="/compilar">Compilar</Link>

            {/* ✅ Contest Link */}
            <Link className="rounded px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to={`/contest/${contestId}`}>Contest</Link>
            <Link className="rounded px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to={`/contest/${contestId}/leaderboard`}>Contest Leaderboard</Link>
            {isAdminUser && (
              <Link className="rounded px-3 py-2 text-slate-300 transition hover:bg-white/5 hover:text-white" to="/admin/contest">Admin</Link>
            )}

            <button className="secondary-button ml-2" onClick={handleAccount}>Account</button>

            {/* 🔥 Account Dropdown */}
            <div
              ref={logoutRef}
              className={`absolute right-4 top-16 z-[999] rounded-lg border border-white/10 bg-[#111827] shadow-2xl sm:right-6 lg:right-10 ${
                isLogoutVisible ? "block" : "hidden"
              }`}
            >
              <div className="flex w-64 max-w-[calc(100vw-2rem)] flex-col items-center gap-3 p-4">
                <img
                  className="h-24 w-24 rounded-md object-cover"
                  src="/user.png"
                  alt="user"
                />

                <h1 className="font-semibold">{user?.data?.username || "Guest"}</h1>
                <Link className="text-sm text-slate-300 hover:text-emerald-300" to = "/dashboard">Dashboard</Link>
                <Link className="text-sm text-slate-300 hover:text-emerald-300" to = "/leaderboard">Leaderboard</Link>
                {user ? (
                  <h1 className="cursor-pointer text-sm font-semibold text-red-300 hover:text-red-200" onClick={handleLogoutToggle}>
                    Logout
                  </h1>
                ) : (
                  <h1 className="cursor-pointer text-sm font-semibold text-emerald-300 hover:text-emerald-200" onClick={handleLogin}>
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
              className="rounded border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none"
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
          className="fixed right-0 top-16 z-50 flex w-full max-w-sm flex-col items-stretch gap-1 border border-white/10 bg-[#111827] p-4 text-white shadow-2xl lg:hidden"
        >
          <Link
            to="/problem"
            className="rounded px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={toggleMenu}
            onTouchStart={prefetchProblems}
          >
            Problem
          </Link>
          <Link to="/submissions" className="rounded px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white" onClick={toggleMenu}>
            Submissions
          </Link>

          {/* ✅ Contest Link */}
          <Link
            to={`/contest/${contestId}`}
            className="rounded px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={toggleMenu}
          >
            Contest
          </Link>

          <Link
            to="/compilar"
            className="rounded px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={toggleMenu}
          >
            Compilar
          </Link>
          <Link
            to={`/contest/${contestId}/leaderboard`}
            className="rounded px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white"
            onClick={toggleMenu}
          >
            Contest Leaderboard
          </Link>
          {isAdminUser && (
            <Link to="/admin/contest" className="rounded px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white" onClick={toggleMenu}>
              Admin
            </Link>
          )}
          <Link to="/leaderboard" className="rounded px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white" onClick={toggleMenu}>
            Leaderboard
          </Link>
          <Link to="/dashboard" className="rounded px-3 py-2 text-slate-300 hover:bg-white/5 hover:text-white" onClick={toggleMenu}>
            Dashboard
          </Link>

          <div className="rounded px-3 py-2" onClick={toggleMenu}>
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
      <div className="h-16" />
    </>
  );
};

export default Navbar;
