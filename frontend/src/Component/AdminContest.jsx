import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const ADMIN_EMAIL = "testadmin@gmail.com";
const ADMIN_PASSWORD = "123456";

const AdminContest = () => {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("codecamp-admin") === "true",
  );
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [problems, setProblems] = useState([]);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    startTime: "",
    endTime: "",
  });
  const [isLoadingProblems, setIsLoadingProblems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    const fetchProblems = async () => {
      setIsLoadingProblems(true);
      try {
        const response = await axios.get(
          "https://codecamp-iffd.onrender.com/api/v1/users/getproblem",
          { withCredentials: true },
        );
        setProblems(response.data.data || []);
      } catch (error) {
        console.log("Failed to fetch problems", error);
        setErrorMessage("Unable to load problems. Please try again.");
      } finally {
        setIsLoadingProblems(false);
      }
    };

    fetchProblems();
  }, [isAdmin]);

  const handleAdminLogin = (event) => {
    event.preventDefault();
    setLoginError("");

    if (
      loginData.email === ADMIN_EMAIL &&
      loginData.password === ADMIN_PASSWORD
    ) {
      localStorage.setItem("codecamp-admin", "true");
      setIsAdmin(true);
      return;
    }

    setLoginError("Invalid admin email or password.");
  };

  const handleProblemToggle = (problemId) => {
    setSelectedProblems((current) =>
      current.includes(problemId)
        ? current.filter((id) => id !== problemId)
        : [...current, problemId],
    );
  };

  const handleCreateContest = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setMessage("");
    setErrorMessage("");

    if (!formData.title || !formData.startTime || !formData.endTime) {
      setErrorMessage("Please fill title, start time, and end time.");
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setErrorMessage("End time must be after start time.");
      return;
    }

    if (selectedProblems.length === 0) {
      setErrorMessage("Select at least one problem for the contest.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "https://codecamp-iffd.onrender.com/api/v1/users/contest",
        {
          title: formData.title,
          problems: selectedProblems,
          startTime: formData.startTime,
          endTime: formData.endTime,
        },
      );

      const contestId = response.data?.data?._id;
      setMessage(
        contestId
          ? `Contest created successfully. Contest ID: ${contestId}`
          : "Contest created successfully.",
      );
      setFormData({ title: "", startTime: "", endTime: "" });
      setSelectedProblems([]);
    } catch (error) {
      console.log("Failed to create contest", error);
      setErrorMessage("Unable to create contest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem("codecamp-admin");
    setIsAdmin(false);
    setLoginData({ email: "", password: "" });
  };

  if (!isAdmin) {
    return (
      <>
        <Navbar />
        <div className="app-bg">
          <div className="app-shell flex justify-center">
            <form onSubmit={handleAdminLogin} className="panel w-full max-w-md p-6 sm:p-8">
              <p className="eyebrow">Admin access</p>
              <h1 className="mt-2 text-2xl font-bold">Contest Admin Login</h1>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Login with the admin credentials to create a new contest.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="admin-email">
                    Email
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    className="field w-full"
                    value={loginData.email}
                    onChange={(event) =>
                      setLoginData((current) => ({
                        ...current,
                        email: event.target.value,
                      }))
                    }
                    placeholder="testadmin@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="admin-password">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    className="field w-full"
                    value={loginData.password}
                    onChange={(event) =>
                      setLoginData((current) => ({
                        ...current,
                        password: event.target.value,
                      }))
                    }
                    placeholder="123456"
                    required
                  />
                </div>

                {loginError && (
                  <p className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {loginError}
                  </p>
                )}

                <button type="submit" className="primary-button w-full">
                  Unlock Admin Panel
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="app-bg">
        <div className="app-shell">
          <div className="page-header sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Admin panel</p>
              <h1 className="page-title mt-2">Create Contest</h1>
              <p className="page-subtitle mt-2">
                Configure contest timing and choose the problems participants will solve.
              </p>
            </div>
            <button className="secondary-button" onClick={handleLogoutAdmin}>
              Lock Admin
            </button>
          </div>

          <form onSubmit={handleCreateContest} className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="panel p-5">
              <h2 className="text-lg font-bold">Contest Details</h2>
              <div className="mt-5 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="contest-title">
                    Contest Title
                  </label>
                  <input
                    id="contest-title"
                    type="text"
                    className="field w-full"
                    value={formData.title}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    placeholder="Weekly DSA Sprint"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="contest-start">
                    Start Time
                  </label>
                  <input
                    id="contest-start"
                    type="datetime-local"
                    className="field w-full"
                    value={formData.startTime}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        startTime: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="contest-end">
                    End Time
                  </label>
                  <input
                    id="contest-end"
                    type="datetime-local"
                    className="field w-full"
                    value={formData.endTime}
                    onChange={(event) =>
                      setFormData((current) => ({
                        ...current,
                        endTime: event.target.value,
                      }))
                    }
                    required
                  />
                </div>

                {message && (
                  <p className="rounded border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                    {message}
                  </p>
                )}

                {errorMessage && (
                  <p className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                    {errorMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="primary-button w-full"
                >
                  {isSubmitting && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  {isSubmitting ? "Creating Contest..." : "Create Contest"}
                </button>
              </div>
            </div>

            <div className="panel p-5">
              <div className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">Select Problems</h2>
                  <p className="mt-1 text-sm text-slate-400">
                    {selectedProblems.length} selected
                  </p>
                </div>
                <span className="status-pill border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                  {problems.length} Available
                </span>
              </div>

              {isLoadingProblems ? (
                <p className="py-8 text-center text-slate-400">Loading problems...</p>
              ) : problems.length === 0 ? (
                <p className="py-8 text-center text-slate-400">No problems available.</p>
              ) : (
                <div className="mt-4 grid max-h-[560px] gap-3 overflow-y-auto pr-1">
                  {problems.map((problem) => {
                    const checked = selectedProblems.includes(problem._id);

                    return (
                      <label
                        key={problem._id}
                        className={`panel-soft flex cursor-pointer items-start gap-3 p-4 transition ${
                          checked ? "border-emerald-500/40 bg-emerald-500/10" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleProblemToggle(problem._id)}
                          className="mt-1 h-4 w-4 accent-emerald-500"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block break-words font-semibold text-white">
                            {problem.title}
                          </span>
                          <span className="mt-2 inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">
                            {problem.difficulty}
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminContest;
