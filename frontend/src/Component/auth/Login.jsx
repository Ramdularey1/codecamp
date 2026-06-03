import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("https://codecamp-iffd.onrender.com/api/v1/users/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status >= 200 && response.status < 300) {
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      } else {
        setErrorMessage(data?.message || "Unable to login. Please try again.");
      }
    } catch (error) {
      console.log("Error while logging in", error);
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0f14] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-[#111827] shadow-2xl md:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden bg-[#0f172a] p-8 md:flex md:flex-col md:justify-between">
          <div>
            <img className="h-16 w-24 object-contain" src="/codecamp.png" alt="CodeCamp" />
            <h1 className="mt-10 text-3xl font-bold leading-tight">
              Practice smarter with CodeCamp.
            </h1>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Sign in to continue solving problems, tracking submissions, and climbing the leaderboard.
            </p>
          </div>
          <div className="rounded border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            Build consistency one problem at a time.
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-8 md:hidden">
            <img className="h-14 w-20 object-contain" src="/codecamp.png" alt="CodeCamp" />
          </div>

          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-wide text-emerald-400">
              Welcome back
            </p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Login to your account</h2>
            <p className="mt-2 text-sm text-slate-400">
              Enter your details to continue your coding journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="you@example.com"
                className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                required
                disabled={isLoading}
                placeholder="Enter your password"
                className="w-full rounded border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            {errorMessage && (
              <p className="rounded border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded bg-emerald-600 px-4 font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-800"
            >
              {isLoading && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => navigate("/signup", { state: { from: "register" } })}
            className="mt-6 w-full text-center text-sm text-slate-400 transition hover:text-emerald-300"
          >
            New to CodeCamp? Create an account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
